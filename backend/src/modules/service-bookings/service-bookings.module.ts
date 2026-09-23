import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { ServiceBookingsController } from './service-bookings.controller.js';
import { ServiceBookingsService } from './service-bookings.service.js';

@Module({ imports: [DatabaseModule], controllers: [ServiceBookingsController], providers: [ServiceBookingsService], exports: [ServiceBookingsService] })
export class ServiceBookingsModule {}
