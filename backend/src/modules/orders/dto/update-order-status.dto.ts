import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
export enum UpdateOrderStatus { NEW = 'NEW', CONFIRMED = 'CONFIRMED', PROCESSING = 'PROCESSING', SHIPPED = 'SHIPPED', OUT_FOR_DELIVERY = 'OUT_FOR_DELIVERY', DELIVERED = 'DELIVERED', CANCELLED = 'CANCELLED', REFUNDED = 'REFUNDED' }
export class UpdateOrderStatusDto {
  @IsEnum(UpdateOrderStatus)
  status!: UpdateOrderStatus;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  reason?: string;
}
