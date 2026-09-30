import { Module } from '@nestjs/common';
import { DatabaseModule } from '../../database/database.module.js';
import { CouponsController } from './coupons.controller.js';
import { CouponsService } from './coupons.service.js';

@Module({ imports: [DatabaseModule], controllers: [CouponsController], providers: [CouponsService], exports: [CouponsService] })
export class CouponsModule {}
