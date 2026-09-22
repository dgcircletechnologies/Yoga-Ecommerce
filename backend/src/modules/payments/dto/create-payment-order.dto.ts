import { Type } from 'class-transformer';
import { IsEmail, IsNotEmpty, IsNumber, IsOptional, IsString, IsUUID, Length, Max, Min } from 'class-validator';

export class CreatePaymentOrderDto {
  @IsUUID()
  orderId!: string;

  @IsString()
  @IsNotEmpty()
  @Length(3, 3)
  currency!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.0001)
  @Max(100000)
  exchangeRate!: number;

  @IsOptional()
  @IsEmail()
  email?: string;
}
