import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { createHash, randomInt } from 'node:crypto';
import { PrismaService } from '../../database/prisma.service.js';
import type { CreateServiceBookingDto } from './dto/create-service-booking.dto.js';

@Injectable()
export class ServiceBookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(customerId: string | undefined, dto: CreateServiceBookingDto) {
    const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId }, include: { trainer: true } });
    if (!service || service.status !== 'ACTIVE') throw new NotFoundException('Service is not available');
    const trainerId = service.trainerId;
    if (!trainerId || !service.trainer || service.trainer.role !== 'TRAINER') throw new ConflictException('This service has no assigned trainer');
    const slots = dto.sessions.map((session) => this.toDate(session.date, session.time));
    if (new Set(slots.map((slot) => slot.toISOString())).size !== slots.length) throw new ConflictException('Each session must use a different date and time');
    const tomorrow = new Date(); tomorrow.setHours(0, 0, 0, 0); tomorrow.setDate(tomorrow.getDate() + 1);
    if (slots.some((slot) => slot < tomorrow)) throw new ConflictException('Sessions can only be scheduled from tomorrow onward');
    // Keep confirmed bookings protected, but do not let an abandoned checkout
    // block a slot forever. Pending payment bookings reserve a slot for 15
    // minutes, which also lets guest checkout work after a failed attempt.
    const pendingHoldStartedAt = new Date(Date.now() - 15 * 60 * 1000);
    const conflict = await this.prisma.serviceSession.findFirst({
      where: {
        scheduledAt: { in: slots },
        status: { not: 'CANCELLED' },
        booking: {
          trainerId,
          status: { not: 'CANCELLED' },
          OR: [
            { status: { in: ['SCHEDULED', 'COMPLETED'] } },
            { status: 'PENDING_PAYMENT', createdAt: { gte: pendingHoldStartedAt } },
          ],
        },
      },
      select: { id: true },
    });
    if (conflict) throw new ConflictException('One or more selected times are no longer available');
    const quantity = slots.length; const total = Number(service.price) * quantity;
    if (!customerId && (!dto.name || !dto.email)) throw new BadRequestException('Name and email are required for guest bookings');
    const user = customerId
      ? await this.prisma.user.findUnique({ where: { id: customerId }, select: { id: true, name: true, email: true, phone: true } })
      : await this.prisma.user.upsert({ where: { email: dto.email!.trim().toLowerCase() }, update: { name: dto.name!.trim(), phone: dto.phone?.trim() }, create: { name: dto.name!.trim(), email: dto.email!.trim().toLowerCase(), phone: dto.phone?.trim(), password: null, role: 'USER' }, select: { id: true, name: true, email: true, phone: true } });
    if (!user) throw new NotFoundException('Customer not found');
    const booking = await this.prisma.$transaction(async (tx) => {
      const order = await tx.order.create({ data: { userId: user.id, name: user.name, email: user.email, phone: user.phone, address: dto.address, city: dto.city, state: dto.state, country: dto.country, postalCode: dto.postalCode, subtotal: total, discount: 0, total, items: { create: { serviceId: service.id, type: 'SERVICE', name: service.name, price: Number(service.price), quantity, discount: 0, total } } }, select: { id: true } });
      await tx.payment.create({ data: { orderId: order.id, amount: total, currency: 'USD' } });
      return tx.serviceBooking.create({ data: { orderId: order.id, serviceId: service.id, trainerId, customerId: user.id, quantity, pricePerSession: service.price, totalAmount: total, address: dto.address, city: dto.city, state: dto.state, country: dto.country, postalCode: dto.postalCode, sessions: { create: slots.map((scheduledAt) => ({ scheduledAt })) } }, include: { sessions: true } });
    });
    return { id: booking.id, orderId: booking.orderId, quantity: booking.quantity, pricePerSession: Number(booking.pricePerSession), totalAmount: Number(booking.totalAmount), status: booking.status, sessions: booking.sessions };
  }

  listForCustomer(customerId: string) { return this.prisma.serviceBooking.findMany({ where: { customerId }, orderBy: { createdAt: 'desc' }, include: { service: { select: { name: true, imageUrl: true } }, trainer: { select: { id: true, name: true, profileImageUrl: true } }, sessions: { orderBy: { scheduledAt: 'asc' } }, order: { select: { payment: { select: { status: true } } } } } }).then((rows) => rows.map((row) => this.present(row, false))); }
  async get(id: string, user: { id: string; role: string }) { const row = await this.prisma.serviceBooking.findUnique({ where: { id }, include: { service: { select: { name: true, imageUrl: true } }, trainer: { select: { id: true, name: true, profileImageUrl: true } }, sessions: { orderBy: { scheduledAt: 'asc' } }, order: { select: { userId: true, payment: { select: { status: true } } } } } }); if (!row || (user.role !== 'ADMIN' && row.customerId !== user.id)) throw new NotFoundException('Service booking not found'); return this.present(row, false); }

  async markPaid(orderId: string) { const booking = await this.prisma.serviceBooking.findUnique({ where: { orderId } }); if (!booking || booking.status !== 'PENDING_PAYMENT') return null; const otp = String(randomInt(100000, 1000000)); const updated = await this.prisma.serviceBooking.update({ where: { id: booking.id }, data: { status: 'SCHEDULED', otpHash: createHash('sha256').update(otp).digest('hex'), otpExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }, include: { sessions: true } }); return { bookingId: updated.id, otp, sessions: updated.sessions }; }

  async cancelPending(orderId: string) {
    await this.prisma.serviceBooking.updateMany({
      where: { orderId, status: 'PENDING_PAYMENT' },
      data: { status: 'CANCELLED' },
    });
  }

  private toDate(date: string, time: string) { const value = new Date(`${date}T${time}:00`); if (Number.isNaN(value.getTime())) throw new ConflictException('Invalid session date or time'); return value; }
  private present(row: any, includeOtp: boolean) { return { id: row.id, orderId: row.orderId, service: row.service, trainer: row.trainer, quantity: row.quantity, pricePerSession: Number(row.pricePerSession), totalAmount: Number(row.totalAmount), status: row.status, paymentStatus: row.order?.payment?.status ?? null, address: { address: row.address, city: row.city, state: row.state, country: row.country, postalCode: row.postalCode }, sessions: row.sessions, ...(includeOtp ? { otp: row.otp } : {}) }; }
}
