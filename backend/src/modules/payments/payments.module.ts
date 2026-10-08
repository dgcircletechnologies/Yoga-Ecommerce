import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { PaymentsController } from './payments.controller.js';
import { PaymentsService } from './payments.service.js';
import { ServiceBookingsModule } from '../service-bookings/service-bookings.module.js';
import { CouponsModule } from '../coupons/coupons.module.js';
import { OrdersModule } from '../orders/orders.module.js';

@Module({ imports: [DatabaseModule, ServiceBookingsModule, CouponsModule, OrdersModule], controllers: [PaymentsController], providers: [PaymentsService], exports: [PaymentsService] })
export class PaymentsModule {}
