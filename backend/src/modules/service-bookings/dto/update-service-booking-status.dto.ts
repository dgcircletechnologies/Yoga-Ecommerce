import { IsEnum } from 'class-validator';

export enum AdminServiceBookingStatus {
  PENDING_PAYMENT = 'PENDING_PAYMENT',
  SCHEDULED = 'SCHEDULED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export class UpdateServiceBookingStatusDto {
  @IsEnum(AdminServiceBookingStatus)
  status!: AdminServiceBookingStatus;
}
