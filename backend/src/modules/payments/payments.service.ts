import { BadRequestException, ConflictException, ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createHmac, timingSafeEqual } from 'node:crypto';
import Razorpay from 'razorpay';
import { PrismaService } from '../../database/prisma.service.js';

type Actor = { id: string; role: string } | undefined;
const paymentSelect = { id: true, orderId: true, status: true, amount: true, currency: true, razorpayOrderId: true, razorpayPaymentId: true, razorpaySignature: true, transactionId: true, paymentMethod: true, failureReason: true, gatewayMetadata: true, paidAt: true, createdAt: true, updatedAt: true } as const;
const USD_TO_INR_RATE = 83.1;

@Injectable()
export class PaymentsService {
  private readonly razorpay: Razorpay;
  private readonly keyId: string;
  private readonly secret: string;
  private readonly webhookSecret?: string;

  constructor(private readonly prisma: PrismaService, config: ConfigService) {
    this.keyId = config.getOrThrow<string>('razorpay.keyId');
    this.secret = config.getOrThrow<string>('razorpay.keySecret');
    this.webhookSecret = config.get<string>('razorpay.webhookSecret') || undefined;
    this.razorpay = new Razorpay({ key_id: this.keyId, key_secret: this.secret });
  }

  private async getOwnedOrder(orderId: string, actor: Actor, email?: string) {
    const order = await this.prisma.order.findUnique({ where: { id: orderId }, include: { payment: true } });
    if (!order) throw new NotFoundException('Order not found');
    const allowed = actor?.role === 'ADMIN' || actor?.id === order.userId || (!actor && email && order.email === email.trim().toLowerCase());
    if (!allowed) throw new ForbiddenException('You do not have access to this order');
    if (!order.payment) throw new ConflictException('This order has no payment record');
    return order;
  }

  private gatewayAmount(total: number) { return Math.round(total * USD_TO_INR_RATE * 100); }

  async createOrder(dto: { orderId: string; customerEmail?: string }, actor: Actor) {
    const order = await this.getOwnedOrder(dto.orderId, actor, dto.customerEmail);
    const payment = order.payment;
    if (!payment) throw new ConflictException('This order has no payment record');
    if (payment.status === 'PAID') throw new ConflictException('This order is already paid');
    if (order.status === 'CANCELLED') throw new ConflictException('Cancelled orders cannot be paid');
    const amount = this.gatewayAmount(Number(order.total));
    if (!amount) throw new ConflictException('Order total must be greater than zero');
    const gatewayOrder = await this.razorpay.orders.create({ amount, currency: 'INR', receipt: order.id.slice(0, 40), notes: { orderId: order.id } });
    const savedPayment = await this.prisma.payment.update({ where: { orderId: order.id }, data: { amount: amount / 100, currency: 'INR', status: 'PENDING', razorpayOrderId: gatewayOrder.id, razorpayPaymentId: null, razorpaySignature: null, transactionId: null, failureReason: null, gatewayMetadata: { source: 'razorpay', attemptCreatedAt: new Date().toISOString() } }, select: paymentSelect });
    return { keyId: this.keyId, orderId: order.id, razorpayOrderId: gatewayOrder.id, amount: gatewayOrder.amount, currency: gatewayOrder.currency, paymentId: savedPayment.id, customer: { name: order.name, email: order.email, contact: order.phone } };
  }

  async verify(dto: { orderId: string; razorpayOrderId: string; razorpayPaymentId: string; razorpaySignature: string; customerEmail?: string }, actor: Actor) {
    const order = await this.getOwnedOrder(dto.orderId, actor, dto.customerEmail);
    const payment = order.payment;
    if (!payment) throw new ConflictException('This order has no payment record');
    if (payment.status === 'PAID' && payment.razorpayPaymentId === dto.razorpayPaymentId) return { success: true, status: 'PAID', orderId: order.id, paymentId: payment.id };
    if (payment.razorpayOrderId !== dto.razorpayOrderId) throw new BadRequestException('Payment order does not match this order');
    const expected = createHmac('sha256', this.secret).update(`${dto.razorpayOrderId}|${dto.razorpayPaymentId}`).digest('hex');
    const valid = expected.length === dto.razorpaySignature.length && timingSafeEqual(Buffer.from(expected), Buffer.from(dto.razorpaySignature));
    if (!valid) throw new UnauthorizedException('Payment verification failed');
    const saved = await this.prisma.$transaction(async (tx) => {
      const current = await tx.payment.findUnique({ where: { orderId: order.id } });
      if (!current) throw new NotFoundException('Payment not found');
      if (current.status === 'PAID') return current;
      const payment = await tx.payment.update({ where: { orderId: order.id }, data: { status: 'PAID', razorpayPaymentId: dto.razorpayPaymentId, razorpaySignature: dto.razorpaySignature, transactionId: dto.razorpayPaymentId, paymentMethod: 'RAZORPAY', paidAt: new Date(), failureReason: null }, select: paymentSelect });
      await tx.order.update({ where: { id: order.id }, data: { status: order.status === 'PENDING' ? 'CONFIRMED' : undefined } });
      return payment;
    });
    return { success: true, status: saved.status, orderId: order.id, paymentId: saved.id };
  }

  async webhook(signature: string | undefined, payload: string, body: any) {
    if (!this.webhookSecret) throw new BadRequestException('Webhook is not configured');
    const expected = createHmac('sha256', this.webhookSecret).update(payload).digest('hex');
    if (!signature || signature.length !== expected.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(signature))) throw new UnauthorizedException('Invalid webhook signature');
    const event = body?.event as string | undefined;
    const entity = body?.payload?.payment?.entity;
    const orderId = entity?.notes?.orderId ?? body?.payload?.order?.entity?.notes?.orderId;
    if (!orderId || !entity) return { received: true };
    const payment = await this.prisma.payment.findUnique({ where: { orderId } });
    if (!payment || payment.status === 'PAID') return { received: true };
    if (event === 'payment.captured' || event === 'payment.authorized') await this.prisma.payment.update({ where: { orderId }, data: { status: 'PAID', razorpayPaymentId: entity.id, transactionId: entity.id, paymentMethod: entity.method ?? 'RAZORPAY', paidAt: new Date(), gatewayMetadata: body } });
    else if (event === 'payment.failed') await this.prisma.payment.update({ where: { orderId }, data: { status: 'FAILED', razorpayPaymentId: entity.id, failureReason: entity.error_description ?? 'Payment failed', gatewayMetadata: body } });
    return { received: true };
  }

  async findAll(status?: string) { return this.prisma.payment.findMany({ where: status ? { status: status as any } : undefined, orderBy: { createdAt: 'desc' }, select: { ...paymentSelect, order: { select: { id: true, name: true, email: true, total: true, status: true, createdAt: true } } } }).then((payments) => payments.map((payment) => ({ ...payment, amount: Number(payment.amount), order: { ...payment.order, total: Number(payment.order.total) } }))); }
  async findOne(id: string, actor: Actor) { const payment = await this.prisma.payment.findUnique({ where: { id }, select: { ...paymentSelect, order: { select: { id: true, userId: true, name: true, email: true, total: true, status: true, createdAt: true } } } }); if (!payment) throw new NotFoundException('Payment not found'); if (actor?.role !== 'ADMIN' && actor?.id !== payment.order.userId) throw new ForbiddenException('You do not have access to this payment'); return { ...payment, amount: Number(payment.amount), order: { ...payment.order, total: Number(payment.order.total) } }; }
}
