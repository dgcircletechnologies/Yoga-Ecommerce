import { IsEnum } from 'class-validator';
export enum UpdateOrderStatus { PENDING = 'PENDING', CONFIRMED = 'CONFIRMED', PROCESSING = 'PROCESSING', COMPLETED = 'COMPLETED', CANCELLED = 'CANCELLED' }
export class UpdateOrderStatusDto { @IsEnum(UpdateOrderStatus) status!: UpdateOrderStatus; }
