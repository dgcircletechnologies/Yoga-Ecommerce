import { IsEmail, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreatePaymentOrderDto {
  @IsUUID() orderId!: string;
  @IsOptional() @IsEmail() customerEmail?: string;
}
