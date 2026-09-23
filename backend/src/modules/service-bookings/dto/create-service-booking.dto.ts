import { Type } from 'class-transformer';
import { ArrayMaxSize, ArrayMinSize, IsDateString, IsEmail, IsNotEmpty, IsOptional, IsString, ValidateNested } from 'class-validator';

class BookingSessionDto {
  @IsDateString() date!: string;
  @IsString() @IsNotEmpty() time!: string;
}

export class CreateServiceBookingDto {
  // These are required for guests. Authenticated users are resolved from the JWT.
  @IsOptional() @IsString() @IsNotEmpty() name?: string;
  @IsOptional() @IsEmail() email?: string;
  @IsOptional() @IsString() phone?: string;
  @IsString() @IsNotEmpty() serviceId!: string;
  @Type(() => BookingSessionDto) @ValidateNested({ each: true }) @ArrayMinSize(1) @ArrayMaxSize(12) sessions!: BookingSessionDto[];
  @IsString() @IsNotEmpty() address!: string;
  @IsString() @IsNotEmpty() city!: string;
  @IsString() @IsNotEmpty() state!: string;
  @IsString() @IsNotEmpty() country!: string;
  @IsString() @IsNotEmpty() postalCode!: string;
}
