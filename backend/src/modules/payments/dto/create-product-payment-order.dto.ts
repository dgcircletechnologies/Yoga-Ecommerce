import { Type } from 'class-transformer';
import { IsNumber, IsString, Length, Max, Min } from 'class-validator';
import { CreateOrderDto } from '../../orders/dto/create-order.dto.js';

export class CreateProductPaymentOrderDto extends CreateOrderDto {
  @IsString()
  @Length(3, 3)
  currency = '';

  @Type(() => Number)
  @IsNumber()
  @Min(0.0001)
  @Max(100000)
  exchangeRate!: number;
}
