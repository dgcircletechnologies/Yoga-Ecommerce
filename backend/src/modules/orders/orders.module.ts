import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { OrdersController } from './orders.controller.js';
import { OrdersService } from './orders.service.js';
import { CouponsModule } from '../coupons/coupons.module.js';
import { OrderEmailService } from './order-email.service.js';
@Module({ imports: [DatabaseModule, CouponsModule], controllers: [OrdersController], providers: [OrdersService, OrderEmailService], exports: [OrdersService] })
export class OrdersModule {}
