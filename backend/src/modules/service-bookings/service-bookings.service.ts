import { BadRequestException, ConflictException, HttpException, HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createCipheriv, createDecipheriv, createHash, randomBytes, randomInt, timingSafeEqual } from 'node:crypto';
import { PrismaService } from '../../database/prisma.service.js';
import type { CreateServiceBookingDto } from './dto/create-service-booking.dto.js';

@Injectable()
export class ServiceBookingsService {
  constructor(private readonly prisma: PrismaService, private readonly config: ConfigService) {}

  async create(customerId: string | undefined, dto: CreateServiceBookingDto) {
    const service = await this.prisma.service.findUnique({ where: { id: dto.serviceId }, include: { trainer: true } });
    if (!service || service.status !== 'ACTIVE') throw new NotFoundException('Service is not available');
    const trainerId = service.trainerId;
    if (!trainerId || !service.trainer || service.trainer.role !== 'TRAINER') throw new ConflictException('This service has no assigned trainer');
    const slots = dto.sessions.map((session) => this.toDate(session.date, session.time));
    if (new Set(slots.map((slot) => slot.toISOString())).size !== slots.length) throw new ConflictException('Each session must use a different date and time');
    const tomorrow = new Date(); tomorrow.setUTCHours(0, 0, 0, 0); tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);
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
            { status: { in: ['PENDING', 'CONFIRMED', 'SCHEDULED', 'COMPLETED'] } },
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

  async listForCustomer(customerId: string) {
    const paidCancelled = await this.prisma.serviceBooking.findMany({ where: { customerId, status: 'CANCELLED', order: { payment: { status: 'PAID' } } }, select: { orderId: true } });
    if (paidCancelled.length) await Promise.all(paidCancelled.map((booking) => this.markPaid(booking.orderId)));
    const rows = await this.prisma.serviceBooking.findMany({ where: { customerId }, orderBy: { createdAt: 'desc' }, include: { service: { select: { name: true, imageUrl: true } }, trainer: { select: { id: true, name: true, profileImageUrl: true } }, sessions: { orderBy: { scheduledAt: 'asc' } }, order: { select: { payment: { select: { status: true } } } } } });
    return rows.map((row) => this.present(row, true));
  }
  async get(id: string, user: { id: string; role: string }) { const row = await this.prisma.serviceBooking.findUnique({ where: { id }, include: { service: { select: { name: true, imageUrl: true } }, trainer: { select: { id: true, name: true, profileImageUrl: true } }, sessions: { orderBy: { scheduledAt: 'asc' } }, order: { select: { userId: true, payment: { select: { status: true } } } } } }); if (!row || (user.role !== 'ADMIN' && row.customerId !== user.id)) throw new NotFoundException('Service booking not found'); return this.present(row, user.role !== 'ADMIN'); }

  async markPaid(orderId: string) { const booking = await this.prisma.serviceBooking.findUnique({ where: { orderId } }); if (!booking || !['PENDING_PAYMENT', 'CANCELLED'].includes(booking.status)) return null; const otp = String(randomInt(100000, 1000000)); const updated = await this.prisma.serviceBooking.update({ where: { id: booking.id }, data: { status: 'PENDING', otp: null, otpEncrypted: this.encryptOtp(otp), otpHash: createHash('sha256').update(otp).digest('hex'), otpExpiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), otpAttempts: 0, otpBlockedUntil: null, otpVerifiedAt: null, verifiedBy: null }, include: { sessions: true } }); return { bookingId: updated.id, otp, sessions: updated.sessions }; }

  async trainerBookings(trainerId: string, filter: 'all' | 'pending' | 'history' = 'all') {
    const where: any = { trainerId, status: filter === 'pending' ? 'PENDING' : filter === 'history' ? { in: ['PAID', 'CONFIRMED', 'SCHEDULED', 'COMPLETED', 'CANCELLED'] } : { not: 'PENDING_PAYMENT' } };
    const rows = await this.prisma.serviceBooking.findMany({ where, orderBy: { createdAt: 'desc' }, include: this.trainerInclude });
    return rows.map((row) => this.presentTrainer(row));
  }

  async trainerHistory(trainerId: string, query: { page?: string; limit?: string; status?: string; date?: string; search?: string }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
    const historyStatuses = ['PAID', 'CONFIRMED', 'SCHEDULED', 'COMPLETED', 'CANCELLED'];
    const status = query.status && historyStatuses.includes(query.status) ? query.status : undefined;
    const search = query.search?.trim();
    const where: any = {
      trainerId,
      status: status ?? { in: historyStatuses },
      ...(query.date ? { sessions: { some: { scheduledAt: { gte: new Date(`${query.date}T00:00:00`), lt: new Date(`${query.date}T23:59:59.999`) } } } } : {}),
      ...(search ? { OR: [{ id: { contains: search, mode: 'insensitive' } }, { customer: { name: { contains: search, mode: 'insensitive' } } }, { service: { name: { contains: search, mode: 'insensitive' } } }] } : {}),
    };
    const [rows, total] = await Promise.all([
      this.prisma.serviceBooking.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' }, include: this.trainerInclude }),
      this.prisma.serviceBooking.count({ where }),
    ]);
    return { items: rows.map((row) => this.presentTrainer(row)), pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
  }

  async trainerBooking(trainerId: string, id: string) {
    const row = await this.prisma.serviceBooking.findFirst({ where: { id, trainerId, status: { not: 'PENDING_PAYMENT' } }, include: this.trainerInclude });
    if (!row) throw new NotFoundException('Trainer booking not found');
    return this.presentTrainer(row);
  }

  async confirmTrainerBooking(trainerId: string, id: string, otp: string) {
    const row = await this.prisma.serviceBooking.findFirst({ where: { id, trainerId }, select: { id: true, status: true, otpHash: true, otpExpiresAt: true, otpAttempts: true, otpBlockedUntil: true, otpVerifiedAt: true } });
    if (!row) throw new NotFoundException('Trainer booking not found');
    if (row.status !== 'PENDING' || row.otpVerifiedAt) throw new ConflictException('Only pending bookings can be confirmed');
    const now = new Date();
    if (row.otpBlockedUntil && row.otpBlockedUntil > now) throw new HttpException('Too many invalid verification attempts. Try again later.', HttpStatus.TOO_MANY_REQUESTS);
    if (!row.otpHash || !row.otpExpiresAt || row.otpExpiresAt < new Date()) throw new ConflictException('This booking OTP has expired');
    const expected = Buffer.from(row.otpHash, 'hex');
    const received = createHash('sha256').update(otp.trim()).digest();
    if (expected.length !== received.length || !timingSafeEqual(expected, received)) {
      const attempts = row.otpBlockedUntil && row.otpBlockedUntil <= now ? 1 : row.otpAttempts + 1;
      await this.prisma.serviceBooking.update({ where: { id: row.id }, data: { otpAttempts: attempts, otpBlockedUntil: attempts >= 5 ? new Date(now.getTime() + 15 * 60 * 1000) : null } });
      throw new BadRequestException('Invalid verification code');
    }
    const claimed = await this.prisma.serviceBooking.updateMany({ where: { id: row.id, trainerId, status: 'PENDING', otpVerifiedAt: null }, data: { status: 'CONFIRMED', otpVerifiedAt: now, verifiedBy: trainerId, otpBlockedUntil: null } });
    if (!claimed.count) throw new ConflictException('This booking has already been confirmed');
    await this.prisma.serviceSession.updateMany({ where: { bookingId: row.id, status: 'SCHEDULED' }, data: { status: 'CONFIRMED' } });
    const updated = await this.prisma.serviceBooking.findUniqueOrThrow({ where: { id: row.id }, select: { id: true, status: true, otpVerifiedAt: true } });
    return { id: updated.id, status: updated.status, verifiedAt: updated.otpVerifiedAt };
  }

  async trainerDashboard(trainerId: string) {
    const now = new Date();
    const start = new Date(now); start.setHours(0, 0, 0, 0);
    const end = new Date(start); end.setDate(end.getDate() + 1);
    const assigned: any = { trainerId, status: { notIn: ['PENDING_PAYMENT', 'CANCELLED'] as const } };
    const [totalBookings, pendingBookings, confirmedBookings, completedBookings, todayBookings, upcomingBookings, recent] = await Promise.all([
      this.prisma.serviceBooking.count({ where: assigned }),
      this.prisma.serviceBooking.count({ where: { trainerId, status: 'PENDING' } }),
      this.prisma.serviceBooking.count({ where: { trainerId, status: { in: ['PAID', 'CONFIRMED', 'SCHEDULED'] } } }),
      this.prisma.serviceBooking.count({ where: { trainerId, status: 'COMPLETED' } }),
      this.prisma.serviceBooking.count({ where: { ...assigned, sessions: { some: { scheduledAt: { gte: start, lt: end }, status: { not: 'CANCELLED' } } } } }),
      this.prisma.serviceBooking.count({ where: { ...assigned, sessions: { some: { scheduledAt: { gte: now }, status: { not: 'CANCELLED' } } } } }),
      this.prisma.serviceBooking.findMany({ where: assigned, take: 5, orderBy: { createdAt: 'desc' }, include: this.trainerInclude }),
    ]);
    return { totalBookings, pendingBookings, confirmedBookings, completedBookings, todayBookings, upcomingBookings, recentBookings: recent.map((row) => this.presentTrainer(row)) };
  }

  async cancelPending(orderId: string) {
    await this.prisma.serviceBooking.updateMany({
      where: { orderId, status: 'PENDING_PAYMENT' },
      data: { status: 'CANCELLED' },
    });
  }

  async adminList(query: { page?: string; limit?: string; search?: string; status?: string; paymentStatus?: string; serviceId?: string; trainerId?: string; date?: string; upcoming?: string }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.min(50, Math.max(1, Number(query.limit) || 10));
    const search = query.search?.trim();
    const where: any = {
      ...(query.status ? { status: query.status } : {}),
      ...(query.serviceId ? { serviceId: query.serviceId } : {}),
      ...(query.trainerId ? { trainerId: query.trainerId } : {}),
      ...(query.paymentStatus ? { order: { payment: { status: query.paymentStatus } } } : {}),
      ...(search ? { OR: [{ id: { contains: search, mode: 'insensitive' } }, { order: { is: { name: { contains: search, mode: 'insensitive' } } } }, { order: { is: { email: { contains: search, mode: 'insensitive' } } } }, { service: { is: { name: { contains: search, mode: 'insensitive' } } } }, { trainer: { is: { name: { contains: search, mode: 'insensitive' } } } }] } : {}),
      ...(query.date ? { sessions: { some: { scheduledAt: { gte: new Date(`${query.date}T00:00:00`), lt: new Date(`${query.date}T23:59:59.999`) } } } } : {}),
      ...(query.upcoming === 'true' ? { sessions: { some: { scheduledAt: { gte: new Date() }, status: { not: 'CANCELLED' } } } } : {}),
    };
    const [rows, total] = await Promise.all([
      this.prisma.serviceBooking.findMany({ where, skip: (page - 1) * limit, take: limit, orderBy: { createdAt: 'desc' }, include: this.adminInclude }),
      this.prisma.serviceBooking.count({ where }),
    ]);
    return { items: rows.map((row) => this.presentAdmin(row)), pagination: { page, limit, total, totalPages: Math.max(1, Math.ceil(total / limit)) } };
  }

  async adminStats() {
    const [total, pending, scheduled, completed, cancelled, revenue, upcoming] = await Promise.all([
      this.prisma.serviceBooking.count(),
      this.prisma.serviceBooking.count({ where: { status: { in: ['PENDING_PAYMENT', 'PENDING'] } } }),
      this.prisma.serviceBooking.count({ where: { status: { in: ['CONFIRMED', 'SCHEDULED'] } } }),
      this.prisma.serviceBooking.count({ where: { status: 'COMPLETED' } }),
      this.prisma.serviceBooking.count({ where: { status: 'CANCELLED' } }),
      this.prisma.serviceBooking.aggregate({ _sum: { totalAmount: true }, where: { order: { payment: { status: 'PAID' } } } }),
      this.prisma.serviceSession.count({ where: { scheduledAt: { gte: new Date() }, status: { not: 'CANCELLED' }, booking: { status: { not: 'CANCELLED' } } } }),
    ]);
    return { total, pending, scheduled, upcoming, completed, cancelled, revenue: Number(revenue._sum.totalAmount ?? 0) };
  }

  async adminGet(id: string) {
    const row = await this.prisma.serviceBooking.findUnique({ where: { id }, include: this.adminInclude });
    if (!row) throw new NotFoundException('Service booking not found');
    return this.presentAdmin(row);
  }

  async updateStatus(id: string, status: string) {
    try {
      return this.presentAdmin(await this.prisma.serviceBooking.update({ where: { id }, data: { status: status as never }, include: this.adminInclude }));
    } catch { throw new NotFoundException('Service booking not found'); }
  }

  private readonly adminInclude = { service: true, trainer: { select: { id: true, name: true, email: true, phone: true, profileImageUrl: true, specialty: true, experience: true } }, sessions: { orderBy: { scheduledAt: 'asc' as const } }, order: { include: { payment: true } } } as const;

  private readonly trainerInclude = { service: { select: { id: true, name: true, imageUrl: true } }, customer: { select: { id: true, name: true, email: true, phone: true } }, sessions: { orderBy: { scheduledAt: 'asc' as const } }, order: { select: { payment: { select: { status: true } } } } } as const;

  private presentAdmin(row: any) { return { id: row.id, orderId: row.orderId, service: row.service ? { id: row.service.id, name: row.service.name, description: row.service.description, price: Number(row.service.price), imageUrl: row.service.imageUrl } : null, trainer: row.trainer, customer: { id: row.customerId, name: row.order?.name, email: row.order?.email, phone: row.order?.phone, address: row.order ? { address: row.order.address, city: row.order.city, state: row.order.state, country: row.order.country, postalCode: row.order.postalCode } : null }, quantity: row.quantity, pricePerSession: Number(row.pricePerSession), totalAmount: Number(row.totalAmount), status: row.status, payment: row.order?.payment ? { id: row.order.payment.id, status: row.order.payment.status, amount: Number(row.order.payment.amount), currency: row.order.payment.currency, paymentMethod: row.order.payment.paymentMethod, paidAt: row.order.payment.paidAt } : null, sessions: row.sessions, createdAt: row.createdAt, updatedAt: row.updatedAt }; }

  private presentTrainer(row: any) { return { id: row.id, orderId: row.orderId, customer: row.customer, service: row.service, address: { address: row.address, city: row.city, state: row.state, country: row.country, postalCode: row.postalCode }, quantity: row.quantity, pricePerSession: Number(row.pricePerSession), totalAmount: Number(row.totalAmount), paymentStatus: row.order?.payment?.status ?? null, status: row.status, otpVerified: Boolean(row.otpVerifiedAt), verifiedAt: row.otpVerifiedAt, sessions: row.sessions, createdAt: row.createdAt, updatedAt: row.updatedAt }; }

  private toDate(date: string, time: string) {
    // Treat the selected wall-clock value as a fixed UTC value. No browser
    // or server timezone conversion is applied.
    const value = new Date(`${date}T${time}:00Z`);
    if (Number.isNaN(value.getTime())) throw new ConflictException('Invalid session date or time');
    return value;
  }
  private present(row: any, includeOtp: boolean) { return { id: row.id, orderId: row.orderId, service: row.service, trainer: row.trainer, quantity: row.quantity, pricePerSession: Number(row.pricePerSession), totalAmount: Number(row.totalAmount), status: row.status, paymentStatus: row.order?.payment?.status ?? null, address: { address: row.address, city: row.city, state: row.state, country: row.country, postalCode: row.postalCode }, sessions: row.sessions, ...(includeOtp ? { otp: row.otpEncrypted ? this.decryptOtp(row.otpEncrypted) : row.otp ?? null } : {}) }; }

  private encryptionKey() { return createHash('sha256').update(this.config.getOrThrow<string>('jwtSecret')).digest(); }
  private encryptOtp(otp: string) { const iv = randomBytes(12); const cipher = createCipheriv('aes-256-gcm', this.encryptionKey(), iv); const encrypted = Buffer.concat([cipher.update(otp, 'utf8'), cipher.final()]); return `${iv.toString('base64url')}.${cipher.getAuthTag().toString('base64url')}.${encrypted.toString('base64url')}`; }
  private decryptOtp(value: string) { try { const [ivValue, tagValue, encryptedValue] = value.split('.'); const decipher = createDecipheriv('aes-256-gcm', this.encryptionKey(), Buffer.from(ivValue, 'base64url')); decipher.setAuthTag(Buffer.from(tagValue, 'base64url')); return Buffer.concat([decipher.update(Buffer.from(encryptedValue, 'base64url')), decipher.final()]).toString('utf8'); } catch { return null; } }
}
