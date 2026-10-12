import { Transform, Type } from 'class-transformer';
import { IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxLength, Min } from 'class-validator';

export class UpdateShipmentDto {
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() : value))
  courierName?: string;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : String(value).trim()))
  @IsString()
  @MaxLength(100)
  trackingNumber?: string | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : String(value).trim()))
  @IsString()
  @MaxLength(100)
  courierServiceType?: string | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : String(value).trim()))
  @IsString()
  @MaxLength(50)
  packageType?: string | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : String(value).trim()))
  @IsString()
  @MaxLength(500)
  packageDescription?: string | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : String(value).trim()))
  @IsString()
  @MaxLength(1000)
  notes?: string | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : Number(value)))
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  weight?: number | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : String(value).trim().toLowerCase()))
  @IsString()
  @MaxLength(20)
  weightUnit?: string | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : Number(value)))
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  length?: number | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : Number(value)))
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  width?: number | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : Number(value)))
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  height?: number | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : String(value).trim().toLowerCase()))
  @IsString()
  @MaxLength(20)
  dimensionUnit?: string | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : Number(value)))
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0)
  shippingCost?: number | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : new Date(value)))
  @IsDate()
  shippedAt?: Date | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : new Date(value)))
  @IsDate()
  expectedDeliveryAt?: Date | null;

  @IsOptional()
  @Transform(({ value }) => (value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : new Date(value)))
  @IsDate()
  deliveredAt?: Date | null;
}

