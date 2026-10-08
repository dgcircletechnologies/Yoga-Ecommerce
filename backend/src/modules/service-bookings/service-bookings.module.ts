import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { ServiceBookingsController } from './service-bookings.controller.js';
import { ServiceBookingsService } from './service-bookings.service.js';
import { CouponsModule } from '../coupons/coupons.module.js';
import { BookingEmailService } from './booking-email.service.js';

@Module({ imports: [DatabaseModule, CouponsModule], controllers: [ServiceBookingsController], providers: [ServiceBookingsService, BookingEmailService], exports: [ServiceBookingsService] })
export class ServiceBookingsModule {}
