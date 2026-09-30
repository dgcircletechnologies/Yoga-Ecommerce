import { Type } from 'class-transformer';
import { IsArray, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, Min, ValidateNested } from 'class-validator';

export enum CouponItemType {
  PRODUCT = 'PRODUCT',
  SERVICE = 'SERVICE',
}

export class CouponItemDto {
  @IsEnum(CouponItemType) type!: CouponItemType;
  @IsOptional() @IsUUID() productId?: string;
  @IsOptional() @IsUUID() serviceId?: string;
  @Type(() => Number) @IsInt() @Min(1) quantity!: number;
}

export class ApplyCouponDto {
  @IsString() @IsNotEmpty() @MaxLength(100) code!: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => CouponItemDto) items!: CouponItemDto[];
}

export class RemoveCouponDto {
  @IsArray() @ValidateNested({ each: true }) @Type(() => CouponItemDto) items!: CouponItemDto[];
}
