import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CurrentUser } from '../../common/decorators/current-user.decorator.js';
import { Public } from '../../common/decorators/public.decorator.js';
import { CreateServiceBookingDto } from './dto/create-service-booking.dto.js';
import { ServiceBookingsService } from './service-bookings.service.js';

@Controller('service-bookings') @ApiTags('service-bookings') @ApiBearerAuth()
export class ServiceBookingsController {
  constructor(private readonly bookings: ServiceBookingsService) {}
  // A booking is intentionally public: guests provide their details in the checkout form.
  @Public()
  @Post()
  create(@CurrentUser() user: { id: string } | undefined, @Body() dto: CreateServiceBookingDto) { return this.bookings.create(user?.id, dto).then((data) => ({ success: true, data })); }
  @Get() list(@CurrentUser() user: { id: string }) { return this.bookings.listForCustomer(user.id).then((data) => ({ success: true, data })); }
  @Get(':id') get(@CurrentUser() user: { id: string; role: string }, @Param('id') id: string) { return this.bookings.get(id, user).then((data) => ({ success: true, data })); }
}
