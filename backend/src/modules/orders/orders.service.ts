import { ConflictException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Prisma } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';
import type { CreateOrderDto } from './dto/create-order.dto.js';
import type { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';
import { CouponsService } from '../coupons/coupons.service.js';
import { OrderEmailService } from './order-email.service.js';
const orderSelect = {
  id: true,
  userId: true,
  status: true,
  subtotal: true,
  discount: true,
  shippingCharge: true,
  total: true,
  couponId: true,
  couponCode: true,
  couponDiscountType: true,
  couponDiscountValue: true,
  couponDiscountAmount: true,
  name: true,
  email: true,
  phone: true,
  countryCode: true,
  address: true,
  city: true,
  state: true,
  country: true,
  postalCode: true,
  createdAt: true,
  updatedAt: true,
  items: {
    orderBy: { createdAt: 'asc' as const },
    select: {
      id: true,
      productId: true,
      serviceId: true,
      type: true,
      name: true,
      price: true,
      quantity: true,
      discount: true,
      total: true,
      weight: true,
      weightUnit: true,
      length: true,
      width: true,
      height: true,
      dimensionUnit: true,
      material: true,
      color: true,
      manufacturer: true,
      modelNumber: true,
      countryOfOrigin: true,
      careInstructions: true,
      product: {
        select: {
          imageUrl: true,
          weight: true,
          weightUnit: true,
          length: true,
          width: true,
          height: true,
          dimensionUnit: true,
          material: true,
          color: true,
          manufacturer: true,
          modelNumber: true,
          countryOfOrigin: true,
          careInstructions: true,
        },
      },
      service: { select: { imageUrl: true, sessions: true } },
    },
  },
  payment: {
    select: {
      id: true,
      status: true,
      amount: true,
      currency: true,
      transactionId: true,
      paymentMethod: true,
      paidAt: true,
    },
  },
  shipment: {
    select: {
      id: true,
      orderId: true,
      courierName: true,
      trackingNumber: true,
      courierServiceType: true,
      packageType: true,
      weight: true,
      weightUnit: true,
      length: true,
      width: true,
      height: true,
      dimensionUnit: true,
      shippingCost: true,
      shippedAt: true,
      expectedDeliveryAt: true,
      deliveredAt: true,
      packageDescription: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
    },
  },
} as const;
const productOnly = { items: { some: { type: 'PRODUCT' as const }, none: { type: 'SERVICE' as const } } };
function code(error: unknown) { return error && typeof error === 'object' && 'code' in error ? error.code : undefined; }
function normalizeStatus(value: string) { return value.trim().toLowerCase(); }
@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService, private readonly config: ConfigService, private readonly coupons: CouponsService, private readonly orderEmails: OrderEmailService) {}
  async findAll(query: { status?: string; search?: string }, isAdmin = false) {
    const search = query.search?.trim();
    const orders = await this.prisma.order.findMany({
      where: {
        ...productOnly,
        ...(query.status ? { status: { equals: normalizeStatus(query.status), mode: 'insensitive' } } : {}),
        ...(search
          ? {
              OR: [
                { id: { contains: search, mode: 'insensitive' } },
                { name: { contains: search, mode: 'insensitive' } },
                { email: { contains: search, mode: 'insensitive' } },
                { shipment: { trackingNumber: { contains: search, mode: 'insensitive' } } },
              ],
            }
          : {}),
      },
      orderBy: { createdAt: 'desc' },
      select: orderSelect,
    });
    return orders.map((order) => this.present(order, isAdmin));
  }
  async adminList(query: { page?: string; limit?: string; status?: string; other?: string; search?: string; sort?: string }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 20));
    const search = query.search?.trim();
    const where: any = {
      ...productOnly,
      ...(query.status
        ? { status: { equals: normalizeStatus(query.status), mode: 'insensitive' } }
        : query.other === 'true'
          ? { status: { notIn: ['new', 'delivered', 'cancelled'] } }
          : {}),
      ...(search
        ? {
            OR: [
              { id: { contains: search, mode: 'insensitive' } },
              { name: { contains: search, mode: 'insensitive' } },
              { email: { contains: search, mode: 'insensitive' } },
              { phone: { contains: search, mode: 'insensitive' } },
              { shipment: { trackingNumber: { contains: search, mode: 'insensitive' } } },
            ],
          }
        : {}),
    };
    const orderBy =
      query.sort === 'oldest'
        ? { createdAt: 'asc' as const }
        : query.sort === 'highest'
          ? { total: 'desc' as const }
          : query.sort === 'lowest'
            ? { total: 'asc' as const }
            : query.sort === 'updated'
              ? { updatedAt: 'desc' as const }
              : { createdAt: 'desc' as const };
    const [orders, total] = await Promise.all([
      this.prisma.order.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy, select: orderSelect }),
      this.prisma.order.count({ where }),
    ]);
    return {
      items: orders.map((order) => this.present(order, true)),
      pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) },
    };
  }
  async findForUser(userId: string) {
    const orders = await this.prisma.order.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, select: orderSelect });
    return orders.map((order) => this.present(order, false));
  }
  async findOne(id: string, userId?: string, isAdmin = false, productOnly = false) {
    const order = await this.prisma.order.findUnique({ where: { id }, select: orderSelect });
    if (!order) throw new NotFoundException('Order not found');
    if (productOnly && (!order.items.some((item) => item.type === 'PRODUCT') || order.items.some((item) => item.type === 'SERVICE')))
      throw new NotFoundException('Product order not found');
    if (!isAdmin && userId && order.userId !== userId) throw new ForbiddenException('You do not have access to this order');
    return this.present(order, isAdmin);
  }
  async findOneForUser(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({ where: { id, userId }, select: orderSelect });
    if (!order) throw new NotFoundException('Order not found');
    return this.present(order, false);
  }
  async create(_userId: string | undefined, _dto: CreateOrderDto) {
    throw new ConflictException('Product orders are created only after successful payment');
  }
  async createPaid(userId: string | undefined, dto: CreateOrderDto, pricing: any, shippingCharge: number, payment: { amount: number; currency: string; paymentMethod: string; transactionId: string; paidAt: Date }) {
    if (!dto.items.length) throw new ConflictException('An order must contain at least one item');
    const itemData = pricing.items;
    const subtotal = pricing.subtotal;
    const total = pricing.total + shippingCharge;
    if (userId) await this.prisma.user.update({ where: { id: userId }, data: { name: dto.name.trim(), phone: dto.phone?.trim() || null, countryCode: dto.countryCode || null, address1: dto.address.trim(), city: dto.city.trim(), state: dto.state.trim(), country: dto.country.trim(), postalCode: dto.postalCode.trim() } });
    const order = await this.prisma.$transaction(async (transaction) => { let resolvedUserId = userId; if (!resolvedUserId) { const normalizedEmail = dto.email.trim().toLowerCase(); const existing = await transaction.user.findUnique({ where: { email: normalizedEmail }, select: { id: true } }); resolvedUserId = existing?.id ?? (await transaction.user.create({ data: { name: dto.name.trim(), email: normalizedEmail, phone: dto.phone?.trim(), countryCode: dto.countryCode, address1: dto.address.trim(), city: dto.city.trim(), state: dto.state.trim(), country: dto.country.trim(), postalCode: dto.postalCode.trim(), role: 'USER' }, select: { id: true } })).id; } const created = await transaction.order.create({ data: { userId: resolvedUserId, status: 'new', name: dto.name.trim(), email: dto.email.trim().toLowerCase(), phone: dto.phone?.trim(), countryCode: dto.countryCode, address: dto.address.trim(), city: dto.city.trim(), state: dto.state.trim(), country: dto.country.trim(), postalCode: dto.postalCode.trim(), subtotal, discount: 0, shippingCharge, total, couponId: pricing.coupon?.id, couponCode: pricing.coupon?.code, couponDiscountType: pricing.coupon?.discountType, couponDiscountValue: pricing.coupon?.discountValue, couponDiscountAmount: pricing.coupon ? pricing.discountAmount : null, items: { create: itemData } }, select: { id: true } }); await transaction.payment.create({ data: { orderId: created.id, amount: payment.amount, currency: payment.currency, status: 'PAID', paymentMethod: payment.paymentMethod, transactionId: payment.transactionId, paidAt: payment.paidAt } }); await transaction.orderStatusHistory.create({ data: { orderId: created.id, fromStatus: null, toStatus: 'new' } }); await this.coupons.finalizeUsage(created.id, transaction); return created; });
    const savedOrder = await this.findOne(order.id, userId, Boolean(userId));
    await this.orderEmails.sendOrderConfirmation(savedOrder);
    return savedOrder;
  }
  async updateStatus(id: string, dto: UpdateOrderStatusDto) {
    const current = await this.prisma.order.findFirst({ where: { id, ...productOnly }, select: { status: true } });
    if (!current) throw new NotFoundException('Product order not found');
    const updated = this.present(await this.changeStatus(id, dto.status), true);
    await this.orderEmails.sendOrderStatusUpdate(updated, normalizeStatus(current.status));
    return updated;
  }
  async changeStatus(id: string, requestedStatus: string, client: Prisma.TransactionClient | PrismaService = this.prisma, productOnlyOrder = true) { const newStatus = normalizeStatus(requestedStatus); if (!newStatus) throw new ConflictException('Order status must be a non-empty string'); const current = await client.order.findFirst({ where: { id, ...(productOnlyOrder ? productOnly : {}) }, select: { status: true } }); if (!current) throw new NotFoundException(productOnlyOrder ? 'Product order not found' : 'Order not found'); if (normalizeStatus(current.status) === newStatus) throw new ConflictException(`Order is already in status ${newStatus}`); await client.orderStatusHistory.create({ data: { orderId: id, fromStatus: normalizeStatus(current.status), toStatus: newStatus } }); return client.order.update({ where: { id }, data: { status: newStatus }, select: orderSelect }); }
  async changeStatusInTransaction(id: string, requestedStatus: string, client: Prisma.TransactionClient, productOnlyOrder = false) { return this.changeStatus(id, requestedStatus, client, productOnlyOrder); }
  async history(id: string, userId: string, isAdmin = false) { const order = await this.prisma.order.findFirst({ where: { id, ...(isAdmin ? productOnly : { userId }) }, select: { id: true } }); if (!order) throw new NotFoundException('Order not found'); return this.prisma.orderStatusHistory.findMany({ where: { orderId: id }, orderBy: { createdAt: 'asc' }, select: { id: true, orderId: true, fromStatus: true, toStatus: true, createdAt: true } }); }
  async adminStats() { const rows = await this.prisma.order.groupBy({ by: ['status'], where: productOnly, _count: { _all: true }, _sum: { total: true, shippingCharge: true } }); const counts = rows.reduce<Record<string, number>>((result, row) => { const status = normalizeStatus(row.status); result[status] = (result[status] ?? 0) + row._count._all; return result; }, {}); const totals = rows.reduce((result, row) => ({ total: result.total + Number(row._sum.total ?? 0), shipping: result.shipping + Number(row._sum.shippingCharge ?? 0) }), { total: 0, shipping: 0 }); return { counts, totalValue: totals.total, totalShipping: totals.shipping, totalOrders: rows.reduce((sum, row) => sum + row._count._all, 0) }; }

  // Shipment CRUD Operations
  async createShipment(orderId: string, dto: import('./dto/create-shipment.dto.js').CreateShipmentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
      select: { id: true, shipment: { select: { id: true } } },
    });
    if (!order) throw new NotFoundException('Order not found');
    if (order.shipment) throw new ConflictException('A shipment already exists for this order');

    if (dto.shippedAt && dto.expectedDeliveryAt && new Date(dto.expectedDeliveryAt) < new Date(dto.shippedAt)) {
      throw new ConflictException('Expected delivery date cannot be before shipped date');
    }
    if (dto.shippedAt && dto.deliveredAt && new Date(dto.deliveredAt) < new Date(dto.shippedAt)) {
      throw new ConflictException('Delivered date cannot be before shipped date');
    }

    try {
      const created = await this.prisma.shipment.create({
        data: {
          orderId,
          courierName: dto.courierName,
          trackingNumber: dto.trackingNumber,
          courierServiceType: dto.courierServiceType,
          packageType: dto.packageType,
          packageDescription: dto.packageDescription,
          notes: dto.notes,
          weight: dto.weight !== undefined && dto.weight !== null ? dto.weight : undefined,
          weightUnit: dto.weightUnit,
          length: dto.length !== undefined && dto.length !== null ? dto.length : undefined,
          width: dto.width !== undefined && dto.width !== null ? dto.width : undefined,
          height: dto.height !== undefined && dto.height !== null ? dto.height : undefined,
          dimensionUnit: dto.dimensionUnit,
          shippingCost: dto.shippingCost !== undefined && dto.shippingCost !== null ? dto.shippingCost : undefined,
          shippedAt: dto.shippedAt,
          expectedDeliveryAt: dto.expectedDeliveryAt,
          deliveredAt: dto.deliveredAt,
        },
      });
      return this.presentShipment(created, true);
    } catch (error: unknown) {
      if (code(error) === 'P2002') {
        throw new ConflictException('A shipment already exists for this order');
      }
      throw error;
    }
  }

  async getShipment(orderId: string, isAdmin = false) {
    const shipment = await this.prisma.shipment.findUnique({
      where: { orderId },
    });
    if (!shipment) throw new NotFoundException('Shipment not found');
    return this.presentShipment(shipment, isAdmin);
  }

  async updateShipment(orderId: string, dto: import('./dto/update-shipment.dto.js').UpdateShipmentDto) {
    const existing = await this.prisma.shipment.findUnique({
      where: { orderId },
    });
    if (!existing) throw new NotFoundException('Shipment not found');

    const shippedAt = dto.shippedAt !== undefined ? dto.shippedAt : existing.shippedAt;
    const expectedDeliveryAt = dto.expectedDeliveryAt !== undefined ? dto.expectedDeliveryAt : existing.expectedDeliveryAt;
    const deliveredAt = dto.deliveredAt !== undefined ? dto.deliveredAt : existing.deliveredAt;

    if (shippedAt && expectedDeliveryAt && new Date(expectedDeliveryAt) < new Date(shippedAt)) {
      throw new ConflictException('Expected delivery date cannot be before shipped date');
    }
    if (shippedAt && deliveredAt && new Date(deliveredAt) < new Date(shippedAt)) {
      throw new ConflictException('Delivered date cannot be before shipped date');
    }

    const data: Prisma.ShipmentUpdateInput = {};
    if (dto.courierName !== undefined) data.courierName = dto.courierName;
    if (dto.trackingNumber !== undefined) data.trackingNumber = dto.trackingNumber;
    if (dto.courierServiceType !== undefined) data.courierServiceType = dto.courierServiceType;
    if (dto.packageType !== undefined) data.packageType = dto.packageType;
    if (dto.packageDescription !== undefined) data.packageDescription = dto.packageDescription;
    if (dto.notes !== undefined) data.notes = dto.notes;
    if (dto.weight !== undefined) data.weight = dto.weight;
    if (dto.weightUnit !== undefined) data.weightUnit = dto.weightUnit;
    if (dto.length !== undefined) data.length = dto.length;
    if (dto.width !== undefined) data.width = dto.width;
    if (dto.height !== undefined) data.height = dto.height;
    if (dto.dimensionUnit !== undefined) data.dimensionUnit = dto.dimensionUnit;
    if (dto.shippingCost !== undefined) data.shippingCost = dto.shippingCost;
    if (dto.shippedAt !== undefined) data.shippedAt = dto.shippedAt;
    if (dto.expectedDeliveryAt !== undefined) data.expectedDeliveryAt = dto.expectedDeliveryAt;
    if (dto.deliveredAt !== undefined) data.deliveredAt = dto.deliveredAt;

    const updated = await this.prisma.shipment.update({
      where: { orderId },
      data,
    });
    return this.presentShipment(updated, true);
  }

  async deleteShipment(orderId: string) {
    const existing = await this.prisma.shipment.findUnique({
      where: { orderId },
      include: { order: { select: { status: true } } },
    });
    if (!existing) throw new NotFoundException('Shipment not found');

    const status = normalizeStatus(existing.order.status);
    if (existing.shippedAt || existing.deliveredAt || ['shipped', 'out_for_delivery', 'delivered'].includes(status)) {
      throw new ConflictException('Cannot delete shipment for an order that has already been dispatched or delivered');
    }

    await this.prisma.shipment.delete({
      where: { orderId },
    });
    return { success: true, message: 'Shipment deleted successfully' };
  }

  private presentShipment(shipment: any, isAdmin = false) {
    if (!shipment) return null;
    const base = {
      id: shipment.id,
      orderId: shipment.orderId,
      courierName: shipment.courierName,
      trackingNumber: shipment.trackingNumber ?? null,
      courierServiceType: shipment.courierServiceType ?? null,
      packageType: shipment.packageType ?? null,
      packageDescription: shipment.packageDescription ?? null,
      weight: shipment.weight !== null && shipment.weight !== undefined ? Number(shipment.weight) : null,
      weightUnit: shipment.weightUnit ?? null,
      length: shipment.length !== null && shipment.length !== undefined ? Number(shipment.length) : null,
      width: shipment.width !== null && shipment.width !== undefined ? Number(shipment.width) : null,
      height: shipment.height !== null && shipment.height !== undefined ? Number(shipment.height) : null,
      dimensionUnit: shipment.dimensionUnit ?? null,
      shippedAt: shipment.shippedAt ?? null,
      expectedDeliveryAt: shipment.expectedDeliveryAt ?? null,
      deliveredAt: shipment.deliveredAt ?? null,
      createdAt: shipment.createdAt,
      updatedAt: shipment.updatedAt,
    };

    if (isAdmin) {
      return {
        ...base,
        shippingCost: shipment.shippingCost !== null && shipment.shippingCost !== undefined ? Number(shipment.shippingCost) : null,
        notes: shipment.notes ?? null,
      };
    }

    return base;
  }

  private present(order: any, isAdmin = false) {
    return {
      ...order,
      subtotal: Number(order.subtotal),
      discount: Number(order.discount),
      shippingCharge: Number(order.shippingCharge ?? 0),
      total: Number(order.total),
      couponDiscountValue: order.couponDiscountValue === null ? null : Number(order.couponDiscountValue),
      couponDiscountAmount: order.couponDiscountAmount === null ? null : Number(order.couponDiscountAmount),
      items: order.items.map((item: any) => {
        const weight = item.weight ?? item.product?.weight;
        const length = item.length ?? item.product?.length;
        const width = item.width ?? item.product?.width;
        const height = item.height ?? item.product?.height;
        return {
          id: item.id,
          productId: item.productId,
          serviceId: item.serviceId,
          type: item.type,
          name: item.name,
          price: Number(item.price),
          quantity: item.quantity,
          discount: Number(item.discount),
          total: Number(item.total),
          image: item.product?.imageUrl ?? item.service?.imageUrl ?? null,
          sessions: item.service?.sessions ?? null,
          weight: weight === null || weight === undefined ? null : Number(weight),
          weightUnit: item.weightUnit ?? item.product?.weightUnit ?? null,
          length: length === null || length === undefined ? null : Number(length),
          width: width === null || width === undefined ? null : Number(width),
          height: height === null || height === undefined ? null : Number(height),
          dimensionUnit: item.dimensionUnit ?? item.product?.dimensionUnit ?? null,
          material: item.material ?? item.product?.material ?? null,
          color: item.color ?? item.product?.color ?? null,
          manufacturer: item.manufacturer ?? item.product?.manufacturer ?? null,
          modelNumber: item.modelNumber ?? item.product?.modelNumber ?? null,
          countryOfOrigin: item.countryOfOrigin ?? item.product?.countryOfOrigin ?? null,
          careInstructions: item.careInstructions ?? item.product?.careInstructions ?? null,
        };
      }),
      payment: order.payment ? { ...order.payment, amount: Number(order.payment.amount) } : null,
      shipment: order.shipment ? this.presentShipment(order.shipment, isAdmin) : null,
    };
  }
}
