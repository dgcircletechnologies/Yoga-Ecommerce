import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, PrismaClient } from '@prisma/client';
import { PrismaService } from '../../database/prisma.service.js';

type RangeQuery = { range?: string; from?: string; to?: string };
type Window = { start: Date; end: Date; previousStart: Date; previousEnd: Date; bucket: 'day' | 'week' | 'month' };
const DAY = 24 * 60 * 60 * 1000;

function number(value: unknown) { return typeof value === 'bigint' ? Number(value) : Number(value ?? 0); }
function date(value: unknown) { return value instanceof Date ? value.toISOString() : String(value); }
function parseDate(value: string, label: string) { const parsed = new Date(value); if (Number.isNaN(parsed.getTime())) throw new BadRequestException(`Invalid ${label} date`); return parsed; }

@Injectable()
export class AnalyticsService {
  constructor(private readonly prisma: PrismaService) {}

  private getWindow(query: RangeQuery): Window {
    const now = new Date(); let end = new Date(now); let start: Date;
    if (query.range === 'today') { start = new Date(now); start.setHours(0, 0, 0, 0); end = new Date(start.getTime() + DAY); }
    else if (query.range === 'yesterday') { end = new Date(now); end.setHours(0, 0, 0, 0); start = new Date(end.getTime() - DAY); }
    else if (query.range === '7d') { end = now; start = new Date(now.getTime() - 7 * DAY); }
    else if (query.range === '30d' || !query.range) { end = now; start = new Date(now.getTime() - 30 * DAY); }
    else if (query.range === 'month') { start = new Date(now.getFullYear(), now.getMonth(), 1); end = new Date(now.getFullYear(), now.getMonth() + 1, 1); }
    else if (query.range === 'last-month') { start = new Date(now.getFullYear(), now.getMonth() - 1, 1); end = new Date(now.getFullYear(), now.getMonth(), 1); }
    else if (query.range === 'year') { start = new Date(now.getFullYear(), 0, 1); end = new Date(now.getFullYear() + 1, 0, 1); }
    else if (query.range === 'custom' && query.from && query.to) { start = parseDate(query.from, 'from'); end = parseDate(query.to, 'to'); end = new Date(end.getTime() + DAY); }
    else throw new BadRequestException('Invalid analytics date range');
    if (end <= start) throw new BadRequestException('Analytics range must have a positive duration');
    const days = Math.ceil((end.getTime() - start.getTime()) / DAY);
    const previousStart = new Date(start.getTime() - (end.getTime() - start.getTime()));
    return { start, end, previousStart, previousEnd: start, bucket: days > 120 ? 'month' : days > 31 ? 'week' : 'day' };
  }

  async dashboard(query: RangeQuery) {
    const window = this.getWindow(query);
    const [current, previous, trends, paymentStatus, recentOrders, recentPayments, recentUsers, topItems] = await Promise.all([
      this.summary(window.start, window.end), this.summary(window.previousStart, window.previousEnd), this.trends(window), this.paymentStatus(window.start, window.end), this.recentOrders(), this.recentPayments(), this.recentUsers(), this.topItems(window.start, window.end),
    ]);
    const comparison = (key: 'revenue' | 'orders' | 'successfulPayments' | 'customers') => ({ value: current[key], previous: previous[key], change: previous[key] ? Number((((current[key] - previous[key]) / previous[key]) * 100).toFixed(1)) : current[key] ? 100 : 0 });
    return { range: { start: window.start.toISOString(), end: window.end.toISOString(), bucket: window.bucket }, summary: current, comparison: { revenue: comparison('revenue'), orders: comparison('orders'), successfulPayments: comparison('successfulPayments'), customers: comparison('customers') }, revenueTrend: trends.map((item) => ({ label: date(item.label), revenue: number(item.revenue), orders: number(item.orders) })), paymentStatus: paymentStatus.map((item) => ({ status: item.status, count: number(item.count), amount: number(item.amount) })), recentOrders, recentPayments, recentUsers, topItems };
  }

  private async summary(start: Date, end: Date) {
    const [result] = await this.prisma.$queryRaw<Array<{ revenue: Prisma.Decimal; orders: bigint; successfulPayments: bigint; customers: bigint }>>(Prisma.sql`SELECT COALESCE(SUM(CASE WHEN p."status" = 'PAID' THEN o."total" ELSE 0 END), 0) AS revenue, COUNT(DISTINCT o."id") FILTER (WHERE o."createdAt" >= ${start} AND o."createdAt" < ${end}) AS orders, COUNT(DISTINCT p."id") FILTER (WHERE p."status" = 'PAID' AND p."createdAt" >= ${start} AND p."createdAt" < ${end}) AS "successfulPayments", (SELECT COUNT(*) FROM "User" u WHERE u."role" = 'USER' AND u."createdAt" >= ${start} AND u."createdAt" < ${end}) AS customers FROM "Order" o LEFT JOIN "Payment" p ON p."orderId" = o."id" WHERE o."createdAt" >= ${start} AND o."createdAt" < ${end}`);
    return { revenue: number(result?.revenue), orders: number(result?.orders), successfulPayments: number(result?.successfulPayments), customers: number(result?.customers) };
  }

  private async trends(window: Window) {
    const bucket = Prisma.raw(`'${window.bucket}'`);
    return this.prisma.$queryRaw<Array<{ label: Date; revenue: Prisma.Decimal; orders: bigint }>>(Prisma.sql`SELECT DATE_TRUNC(${bucket}, o."createdAt") AS label, COALESCE(SUM(CASE WHEN p."status" = 'PAID' THEN o."total" ELSE 0 END), 0) AS revenue, COUNT(*) AS orders FROM "Order" o LEFT JOIN "Payment" p ON p."orderId" = o."id" WHERE o."createdAt" >= ${window.start} AND o."createdAt" < ${window.end} GROUP BY DATE_TRUNC(${bucket}, o."createdAt") ORDER BY label ASC`);
  }

  private async paymentStatus(start: Date, end: Date) { return this.prisma.$queryRaw<Array<{ status: string; count: bigint; amount: Prisma.Decimal }>>(Prisma.sql`SELECT p."status" AS status, COUNT(*) AS count, COALESCE(SUM(p."amount"), 0) AS amount FROM "Payment" p WHERE p."createdAt" >= ${start} AND p."createdAt" < ${end} GROUP BY p."status" ORDER BY count DESC`); }

  private async recentOrders() {
    const rows = await this.prisma.$queryRaw<Array<any>>(Prisma.sql`SELECT o."id", o."name" AS customer, o."email", o."total", o."status", o."createdAt", COALESCE(p."status", 'PENDING') AS "paymentStatus", COUNT(oi."id")::int AS items FROM "Order" o LEFT JOIN "Payment" p ON p."orderId" = o."id" LEFT JOIN "OrderItem" oi ON oi."orderId" = o."id" GROUP BY o."id", p."status" ORDER BY o."createdAt" DESC LIMIT 8`);
    return rows.map((row) => ({ ...row, total: number(row.total), createdAt: date(row.createdAt), items: number(row.items) }));
  }
  private async recentPayments() {
    const rows = await this.prisma.$queryRaw<Array<any>>(Prisma.sql`SELECT p."id", p."orderId", p."status", p."amount", p."currency", p."paymentMethod", p."razorpayPaymentId", p."createdAt", o."name" AS customer, o."email" FROM "Payment" p JOIN "Order" o ON o."id" = p."orderId" ORDER BY p."createdAt" DESC LIMIT 8`);
    return rows.map((row) => ({ ...row, amount: number(row.amount), createdAt: date(row.createdAt) }));
  }
  private async recentUsers() {
    const rows = await this.prisma.$queryRaw<Array<any>>(Prisma.sql`SELECT u."id", u."name", u."email", u."role", u."createdAt" FROM "User" u WHERE u."role" = 'USER' ORDER BY u."createdAt" DESC LIMIT 8`);
    return rows.map((row) => ({ ...row, createdAt: date(row.createdAt) }));
  }
  private async topItems(start: Date, end: Date) {
    const rows = await this.prisma.$queryRaw<Array<any>>(Prisma.sql`SELECT oi."type", oi."name", SUM(oi."quantity")::int AS units, COALESCE(SUM(oi."total") FILTER (WHERE p."status" = 'PAID'), 0) AS revenue FROM "OrderItem" oi JOIN "Order" o ON o."id" = oi."orderId" LEFT JOIN "Payment" p ON p."orderId" = o."id" WHERE o."createdAt" >= ${start} AND o."createdAt" < ${end} GROUP BY oi."type", oi."name" ORDER BY units DESC, revenue DESC LIMIT 6`);
    return rows.map((row) => ({ type: row.type, name: row.name, units: number(row.units), revenue: number(row.revenue) }));
  }
}
