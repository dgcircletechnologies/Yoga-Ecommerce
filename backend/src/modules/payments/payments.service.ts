import { ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Razorpay from 'razorpay';
import { createHmac, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../../database/prisma.service.js';
import type { CreatePaymentOrderDto } from './dto/create-payment-order.dto.js';
import type { VerifyPaymentDto } from './dto/verify-payment.dto.js';
import type { FailPaymentDto } from './dto/fail-payment.dto.js';

type User = { id: string; role: string } | undefined;
const paymentSelect = { id: true, orderId: true, status: true, amount: true, currency: true, razorpayOrderId: true, razorpayPaymentId: true, razorpaySignature: true, transactionId: true, paymentMethod: true, failureReason: true, gatewayMetadata: true, attempt: true, createdAt: true, updatedAt: true, paidAt: true, order: { select: { id: true, userId: true, name: true, email: true, total: true, status: true, createdAt: true } } } as const;

@Injectable()
export class PaymentsService {
  private readonly razorpay?: Razorpay;
  private readonly keyId: string;
  private readonly keySecret: string;
  private readonly webhookSecret?: string;

  constructor(private readonly prisma: PrismaService, config: ConfigService) {
    const keyId = config.get<string>('razorpay.keyId');
    const keySecret = config.get<string>('razorpay.keySecret');
    this.keyId = keyId ?? '';
    this.keySecret = keySecret ?? '';
    this.webhookSecret = config.get<string>('razorpay.webhookSecret');
    this.razorpay = keyId && keySecret ? new Razorpay({ key_id: keyId, key_secret: keySecret }) : undefined;
  }

  async createOrder(dto: CreatePaymentOrderDto, user: User) {
    const payment = await this.getAccessiblePayment(dto.orderId, user, dto.email);
    if (payment.status === 'PAID') throw new ConflictException('This order has already been paid');
    if (payment.order.status === 'CANCELLED') throw new ConflictException('Cancelled orders cannot be paid');
    const currency = dto.currency.toUpperCase();
    const amount = this.gatewayAmount(Number(payment.order.total), dto.exchangeRate);
    let gatewayOrder: { id: string; amount: number; currency: string };
    try {
      const createdGatewayOrder = await this.client().orders.create({ amount, currency, receipt: payment.orderId.slice(0, 40), notes: { applicationOrderId: payment.orderId } });
      gatewayOrder = { id: createdGatewayOrder.id, amount: Number(createdGatewayOrder.amount), currency: createdGatewayOrder.currency };
    } catch {
      throw new ConflictException('Razorpay is unavailable. Please try again.');
    }
    const saved = await this.prisma.payment.update({ where: { id: payment.id }, data: { status: 'PENDING', amount: gatewayOrder.amount / 100, currency: gatewayOrder.currency, razorpayOrderId: gatewayOrder.id, razorpayPaymentId: null, razorpaySignature: null, transactionId: null, paymentMethod: 'RAZORPAY', failureReason: null, gatewayMetadata: { baseAmount: Number(payment.order.total), baseCurrency: 'USD', frontendExchangeRate: dto.exchangeRate }, attempt: { increment: 1 } }, select: paymentSelect });
    return { keyId: this.keyId, razorpayOrderId: gatewayOrder.id, amount: gatewayOrder.amount, currency: gatewayOrder.currency, paymentId: saved.id, orderId: saved.orderId, attempt: saved.attempt };
  }

  async verify(dto: VerifyPaymentDto, user: User) {
    const payment = await this.getAccessiblePayment(dto.orderId, user, dto.email);
    if (payment.status === 'PAID') return this.present(payment);
    if (payment.razorpayOrderId !== dto.razorpayOrderId) throw new ConflictException('Payment order does not match the application order');
    this.verifySignature(dto.razorpayOrderId, dto.razorpayPaymentId, dto.razorpaySignature);
    let gatewayPayment: { amount: number | string; currency: string; method?: string; status?: string };
    try { gatewayPayment = await this.client().payments.fetch(dto.razorpayPaymentId); } catch { throw new ConflictException('Unable to confirm the Razorpay payment. Please try again.'); }
    if (Number(gatewayPayment.amount) !== Math.round(Number(payment.amount) * 100) || gatewayPayment.currency !== payment.currency) throw new ConflictException('Payment amount or currency does not match the order');
    const saved = await this.prisma.$transaction(async (tx) => {
      const current = await tx.payment.findUnique({ where: { id: payment.id }, select: { status: true } });
      if (current?.status === 'PAID') return tx.payment.findUniqueOrThrow({ where: { id: payment.id }, select: paymentSelect });
      const saved = await tx.payment.update({ where: { id: payment.id }, data: { status: 'PAID', razorpayPaymentId: dto.razorpayPaymentId, razorpaySignature: dto.razorpaySignature, transactionId: dto.razorpayPaymentId, paymentMethod: gatewayPayment.method ?? 'RAZORPAY', paidAt: new Date(), failureReason: null, gatewayMetadata: { ...(payment.gatewayMetadata && typeof payment.gatewayMetadata === 'object' && !Array.isArray(payment.gatewayMetadata) ? payment.gatewayMetadata : {}), gatewayStatus: gatewayPayment.status ?? 'captured' } }, select: paymentSelect });
      if (saved.order?.status === 'PENDING') await tx.order.update({ where: { id: payment.orderId }, data: { status: 'CONFIRMED' } });
      return saved;
    });
    return this.present(saved);
  }

  async fail(dto: FailPaymentDto, user: User) {
    const payment = await this.getAccessiblePayment(dto.orderId, user, dto.email);
    if (payment.razorpayOrderId !== dto.razorpayOrderId || payment.status === 'PAID') return this.present(payment);
    const result = await this.prisma.payment.updateMany({ where: { id: payment.id, status: { not: 'PAID' } }, data: { status: 'FAILED', failureReason: dto.reason ?? 'Payment was not completed', gatewayMetadata: { failureSource: 'checkout' } } });
    return this.present(result.count ? await this.prisma.payment.findUniqueOrThrow({ where: { id: payment.id }, select: paymentSelect }) : payment);
  }

  async webhook(rawBody: string, signature: string) {
    if (!this.webhookSecret) throw new ConflictException('Webhook secret is not configured');
    this.verifyHmac(rawBody, signature, this.webhookSecret);
    const body = JSON.parse(rawBody) as { event?: string; payload?: { payment?: { entity?: { id?: string; order_id?: string; amount?: number; currency?: string; method?: string; error_description?: string; status?: string } } } };
    const entity = body.payload?.payment?.entity;
    if (!entity?.order_id) return { received: true };
    const payment = await this.prisma.payment.findUnique({ where: { razorpayOrderId: entity.order_id }, select: paymentSelect });
    if (!payment || payment.status === 'PAID') return { received: true };
    if (body.event === 'payment.captured' || body.event === 'order.paid') {
      if (entity.amount !== Math.round(Number(payment.amount) * 100) || entity.currency !== payment.currency) throw new ConflictException('Webhook amount or currency does not match the order');
      await this.prisma.$transaction(async (tx) => { await tx.payment.update({ where: { id: payment.id }, data: { status: 'PAID', razorpayPaymentId: entity.id, transactionId: entity.id, paymentMethod: entity.method ?? 'RAZORPAY', paidAt: new Date(), gatewayMetadata: { webhookEvent: body.event, gatewayStatus: entity.status } } }); if (payment.order?.status === 'PENDING') await tx.order.update({ where: { id: payment.orderId }, data: { status: 'CONFIRMED' } }); });
    } else if (body.event === 'payment.failed') {
      await this.prisma.payment.update({ where: { id: payment.id }, data: { status: 'FAILED', failureReason: entity.error_description ?? 'Payment failed', razorpayPaymentId: entity.id, gatewayMetadata: { webhookEvent: body.event, gatewayStatus: entity.status } } });
    }
    return { received: true };
  }

  async findForUser(id: string, user: User, email?: string) { return this.present(await this.getAccessiblePayment(id, user, email)); }

  async findAll(status?: string, search?: string) {
    const payments = await this.prisma.payment.findMany({ where: { ...(status ? { status: status as never } : {}), ...(search ? { OR: [{ id: { contains: search, mode: 'insensitive' } }, { orderId: { contains: search, mode: 'insensitive' } }, { order: { is: { name: { contains: search, mode: 'insensitive' } } } }, { order: { is: { email: { contains: search, mode: 'insensitive' } } } }] } : {}) }, orderBy: { createdAt: 'desc' }, select: paymentSelect }); return payments.map((payment) => this.present(payment));
  }

  private async getAccessiblePayment(id: string, user: User, email?: string) {
    const payment = await this.prisma.payment.findFirst({ where: { OR: [{ id }, { orderId: id }] }, select: paymentSelect });
    if (!payment) throw new NotFoundException('Payment not found');
    if (user?.role !== 'ADMIN' && (!user ? !email || payment.order.email !== email.trim().toLowerCase() : payment.order.userId !== user.id)) throw new ForbiddenException('You do not have access to this payment');
    return payment;
  }

  private gatewayAmount(baseAmount: number, exchangeRate: number) { return Math.max(100, Math.round(baseAmount * exchangeRate * 100)); }
  private client() { if (!this.razorpay) throw new ConflictException('Razorpay is not configured'); return this.razorpay; }
  private verifySignature(orderId: string, paymentId: string, signature: string) { this.verifyHmac(`${orderId}|${paymentId}`, signature, this.keySecret); }
  private verifyHmac(payload: string, signature: string, secret: string) { const expected = createHmac('sha256', secret).update(payload).digest('hex'); const a = Buffer.from(expected); const b = Buffer.from(signature); if (a.length !== b.length || !timingSafeEqual(a, b)) throw new UnauthorizedException('Invalid payment signature'); }
  private present(payment: any) { return { ...payment, amount: Number(payment.amount), order: payment.order ? { ...payment.order, total: Number(payment.order.total) } : undefined }; }
}
