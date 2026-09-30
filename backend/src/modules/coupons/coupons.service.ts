import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import type { CreateCouponDto, UpdateCouponDto } from './dto/manage-coupon.dto.js';

type Item = { productId?: string; serviceId?: string; type: 'PRODUCT' | 'SERVICE'; name: string; price: number; quantity: number; discount: number; total: number };
type Client = PrismaService | Prisma.TransactionClient;

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  async calculate(items: Array<{ type: string; productId?: string; serviceId?: string; quantity: number }>, code?: string, client: Client = this.prisma) {
    if (!items.length) throw new ConflictException('An order must contain at least one item');
    const pricedItems: Item[] = [];
    for (const item of items) pricedItems.push(await this.priceItem(item, client));
    const subtotal = this.round(pricedItems.reduce((sum, item) => sum + item.total, 0));
    if (!code?.trim()) return { items: pricedItems, subtotal, eligibleSubtotal: 0, discountAmount: 0, total: subtotal, coupon: null };

    const coupon = await client.coupon.findFirst({ where: { code: { equals: this.normalizeCode(code), mode: 'insensitive' } } });
    if (!coupon) throw new NotFoundException('Coupon not found');
    const now = new Date();
    if (coupon.status !== 'ACTIVE') throw new ConflictException('Coupon is inactive');
    if (now < coupon.startDate) throw new ConflictException('Coupon has not started');
    if (now > coupon.expiryDate) throw new ConflictException('Coupon has expired');
    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) throw new ConflictException('Coupon usage limit reached');
    const eligibleSubtotal = this.round(pricedItems.filter((item) => coupon.applicableTo === 'BOTH' || coupon.applicableTo === item.type).reduce((sum, item) => sum + item.total, 0));
    if (!eligibleSubtotal) throw new ConflictException('Coupon is not applicable to these items');
    if (coupon.minimumAmount !== null && eligibleSubtotal < Number(coupon.minimumAmount)) throw new ConflictException('Minimum eligible amount not reached');
    const discountAmount = this.round(eligibleSubtotal * Number(coupon.discountValue) / 100);
    return { items: pricedItems, subtotal, eligibleSubtotal, discountAmount, total: this.round(subtotal - discountAmount), coupon: { id: coupon.id, code: coupon.code, discountType: coupon.discountType, discountValue: Number(coupon.discountValue) } };
  }

  async create(dto: CreateCouponDto) {
    const data = this.validateDates({ ...dto, code: this.normalizeCode(dto.code) });
    try { return await this.prisma.coupon.create({ data: data as never }); } catch (error) { this.rethrowConflict(error); }
  }
  async list(page = 1, limit = 20, search?: string) {
    const safePage = Math.max(1, page); const safeLimit = Math.min(50, Math.max(1, limit));
    const where = search?.trim() ? { code: { contains: search.trim(), mode: 'insensitive' as const } } : {};
    const [items, total] = await Promise.all([this.prisma.coupon.findMany({ where, skip: (safePage - 1) * safeLimit, take: safeLimit, orderBy: { createdAt: 'desc' }, include: { _count: { select: { usages: true } } } }), this.prisma.coupon.count({ where })]);
    return { items: items.map((item) => this.presentCoupon(item)), pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.max(1, Math.ceil(total / safeLimit)) } };
  }
  async get(id: string) { const coupon = await this.prisma.coupon.findUnique({ where: { id }, include: { _count: { select: { usages: true } } } }); if (!coupon) throw new NotFoundException('Coupon not found'); return this.presentCoupon(coupon); }
  async update(id: string, dto: UpdateCouponDto) {
    const current = await this.prisma.coupon.findUnique({ where: { id } });
    if (!current) throw new NotFoundException('Coupon not found');
    const data = this.validateDates({ ...current, ...dto, ...(dto.code !== undefined ? { code: this.normalizeCode(dto.code) } : {}) });
    try { return this.presentCoupon(await this.prisma.coupon.update({ where: { id }, data: data as never })); } catch (error) { this.rethrowConflict(error); }
  }
  async setStatus(id: string, status: 'ACTIVE' | 'INACTIVE') { try { return this.presentCoupon(await this.prisma.coupon.update({ where: { id }, data: { status } })); } catch { throw new NotFoundException('Coupon not found'); } }
  async usages(id: string, page = 1, limit = 20) {
    await this.get(id); const safePage = Math.max(1, page); const safeLimit = Math.min(50, Math.max(1, limit));
    const [items, total] = await Promise.all([this.prisma.couponUsage.findMany({ where: { couponId: id }, skip: (safePage - 1) * safeLimit, take: safeLimit, orderBy: { usedAt: 'desc' }, include: { user: { select: { id: true, name: true, email: true } }, order: { select: { id: true, total: true, status: true, createdAt: true } } } }), this.prisma.couponUsage.count({ where: { couponId: id } })]);
    return { items: items.map((item) => ({ ...item, discountAmount: Number(item.discountAmount), order: { ...item.order, total: Number(item.order.total) } })), pagination: { page: safePage, limit: safeLimit, total, totalPages: Math.max(1, Math.ceil(total / safeLimit)) } };
  }

  async finalizeUsage(orderId: string, tx: Prisma.TransactionClient) {
    const order = await tx.order.findUnique({ where: { id: orderId }, select: { couponId: true, couponDiscountAmount: true, userId: true } });
    if (!order?.couponId) return null;
    const existing = await tx.couponUsage.findUnique({ where: { orderId } });
    if (existing) return existing;
    const rows = await tx.$queryRaw<Array<{ id: string; usageLimit: number | null; usageCount: number }>>(Prisma.sql`SELECT "id", "usageLimit", "usageCount" FROM "Coupon" WHERE "id" = ${order.couponId} FOR UPDATE`);
    const coupon = rows[0]; if (!coupon) throw new NotFoundException('Coupon not found');
    const alreadyUsed = await tx.couponUsage.findUnique({ where: { orderId } });
    if (alreadyUsed) return alreadyUsed;
    if (coupon.usageLimit !== null && coupon.usageCount >= coupon.usageLimit) throw new ConflictException('Coupon usage limit reached');
    const usage = await tx.couponUsage.create({ data: { couponId: order.couponId, orderId, userId: order.userId, discountAmount: order.couponDiscountAmount ?? 0 } });
    await tx.coupon.update({ where: { id: order.couponId }, data: { usageCount: { increment: 1 } } });
    return usage;
  }

  normalizeCode(code: string) { return code.trim().toUpperCase(); }
  private async priceItem(item: { type: string; productId?: string; serviceId?: string; quantity: number }, client: Client): Promise<Item> {
    if (item.type === 'PRODUCT') { if (!item.productId || item.serviceId) throw new ConflictException('A product item must reference one product'); const row = await client.product.findUnique({ where: { id: item.productId } }); if (!row) throw new NotFoundException('Product not found'); if (!row.isActive) throw new ConflictException(`${row.name} is unavailable`); const price = Number(row.price); return { productId: row.id, type: 'PRODUCT', name: row.name, price, quantity: item.quantity, discount: 0, total: this.round(price * item.quantity) }; }
    if (!item.serviceId || item.productId) throw new ConflictException('A service item must reference one service'); const row = await client.service.findUnique({ where: { id: item.serviceId } }); if (!row) throw new NotFoundException('Service not found'); if (row.status !== 'ACTIVE') throw new ConflictException(`${row.name} is unavailable`); const price = Number(row.price); return { serviceId: row.id, type: 'SERVICE', name: row.name, price, quantity: item.quantity, discount: 0, total: this.round(price * item.quantity) };
  }
  private validateDates(value: any) { const start = new Date(value.startDate); const expiry = new Date(value.expiryDate); if (Number.isNaN(start.getTime()) || Number.isNaN(expiry.getTime())) throw new ConflictException('Start and expiry dates are required'); if (expiry < start) throw new ConflictException('Expiry date cannot be before start date'); return { code: value.code, discountType: value.discountType ?? 'PERCENTAGE', discountValue: value.discountValue, minimumAmount: value.minimumAmount ?? null, applicableTo: value.applicableTo, startDate: start, expiryDate: expiry, usageLimit: value.usageLimit ?? null, ...(value.status !== undefined ? { status: value.status } : {}) }; }
  private presentCoupon(coupon: any) { const remaining = coupon.usageLimit === null ? null : Math.max(0, coupon.usageLimit - coupon.usageCount); return { ...coupon, discountValue: Number(coupon.discountValue), minimumAmount: coupon.minimumAmount === null ? null : Number(coupon.minimumAmount), remainingUsage: remaining, usageTotal: coupon._count?.usages ?? coupon.usageCount, _count: undefined }; }
  private round(value: number) { return Math.round((value + Number.EPSILON) * 100) / 100; }
  private rethrowConflict(error: unknown): never { if ((error as { code?: string })?.code === 'P2002') throw new ConflictException('Coupon code already exists'); throw error; }
}
