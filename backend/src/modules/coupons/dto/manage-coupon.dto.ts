import { Type } from 'class-transformer';
import { IsDateString, IsEnum, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export enum CouponDiscountTypeDto { PERCENTAGE = 'PERCENTAGE' }
export enum CouponApplicableToDto { PRODUCT = 'PRODUCT', SERVICE = 'SERVICE', BOTH = 'BOTH' }
export enum CouponStatusDto { ACTIVE = 'ACTIVE', INACTIVE = 'INACTIVE' }

export class CreateCouponDto {
  @IsString() @IsNotEmpty() @MaxLength(100) code!: string;
  @IsEnum(CouponDiscountTypeDto) discountType!: CouponDiscountTypeDto;
  @Type(() => Number) @IsNumber() @Min(0.01) @Max(100) discountValue!: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) minimumAmount?: number | null;
  @IsEnum(CouponApplicableToDto) applicableTo!: CouponApplicableToDto;
  @IsDateString() startDate!: string;
  @IsDateString() expiryDate!: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) usageLimit?: number | null;
  @IsOptional() @IsEnum(CouponStatusDto) status?: CouponStatusDto;
}

export class UpdateCouponDto {
  @IsOptional() @IsString() @IsNotEmpty() @MaxLength(100) code?: string;
  @IsOptional() @IsEnum(CouponDiscountTypeDto) discountType?: CouponDiscountTypeDto;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0.01) @Max(100) discountValue?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) minimumAmount?: number | null;
  @IsOptional() @IsEnum(CouponApplicableToDto) applicableTo?: CouponApplicableToDto;
  @IsOptional() @IsDateString() startDate?: string;
  @IsOptional() @IsDateString() expiryDate?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) usageLimit?: number | null;
  @IsOptional() @IsEnum(CouponStatusDto) status?: CouponStatusDto;
}
