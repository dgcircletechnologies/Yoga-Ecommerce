import { Body, Controller, ForbiddenException, Get, Param, Patch, Post, Query } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { CreateServiceBookingDto } from './dto/create-service-booking.dto.js';
import { UpdateServiceBookingStatusDto } from './dto/update-service-booking-status.dto.js';
import { ServiceBookingsService } from './service-bookings.service.js';

@Controller('service-bookings') @ApiTags('service-bookings') @ApiBearerAuth()
export class ServiceBookingsController {
  constructor(private readonly bookings: ServiceBookingsService) {}
  // A booking is intentionally public: guests provide their details in the checkout form.
  @Public()
  @Post()
  create(@CurrentUser() user: { id: string } | undefined, @Body() dto: CreateServiceBookingDto) { return this.bookings.create(user?.id, dto).then((data) => ({ success: true, data })); }
  @Get('admin')
  adminList(@CurrentUser() user: { role: string }, @Query() query: { page?: string; limit?: string; search?: string; status?: string; paymentStatus?: string; serviceId?: string; trainerId?: string; date?: string; upcoming?: string }) { this.requireAdmin(user); return this.bookings.adminList(query).then((data) => ({ success: true, data })); }
  @Get('admin/stats')
  adminStats(@CurrentUser() user: { role: string }) { this.requireAdmin(user); return this.bookings.adminStats().then((data) => ({ success: true, data })); }
  @Get('admin/:id')
  adminGet(@CurrentUser() user: { role: string }, @Param('id') id: string) { this.requireAdmin(user); return this.bookings.adminGet(id).then((data) => ({ success: true, data })); }
  @Patch('admin/:id/status')
  adminStatus(@CurrentUser() user: { role: string }, @Param('id') id: string, @Body() dto: UpdateServiceBookingStatusDto) { this.requireAdmin(user); return this.bookings.updateStatus(id, dto.status).then((data) => ({ success: true, data })); }
  @Get() list(@CurrentUser() user: { id: string }) { return this.bookings.listForCustomer(user.id).then((data) => ({ success: true, data })); }
  @Get(':id') get(@CurrentUser() user: { id: string; role: string }, @Param('id') id: string) { return this.bookings.get(id, user).then((data) => ({ success: true, data })); }
  private requireAdmin(user: { role: string }) { if (user.role !== 'ADMIN') throw new ForbiddenException('Admin access required'); }
}
