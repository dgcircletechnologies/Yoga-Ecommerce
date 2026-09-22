import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class FailPaymentDto {
  @IsUUID() orderId!: string;
  @IsString() @IsNotEmpty() razorpayOrderId!: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() @MaxLength(500) reason?: string;
}
