import { Type } from 'class-transformer';
import { IsNumber, IsString, Length, Max, Min } from 'class-validator';
import { CreateServiceBookingDto } from '../../service-bookings/dto/create-service-booking.dto.js';

export class CreateServicePaymentOrderDto extends CreateServiceBookingDto {
  @IsString()
  @Length(3, 3)
  currency!: string;

  @Type(() => Number)
  @IsNumber()
  @Min(0.0001)
  @Max(100000)
  exchangeRate!: number;
}
