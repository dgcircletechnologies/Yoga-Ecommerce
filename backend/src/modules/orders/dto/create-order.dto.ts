import { Type } from 'class-transformer';
import { IsArray, IsEmail, IsEnum, IsInt, IsNotEmpty, IsOptional, IsString, IsUUID, MaxLength, Min, ValidateNested } from 'class-validator';
export enum CreateOrderItemType { PRODUCT = 'PRODUCT', SERVICE = 'SERVICE' }
export class CreateOrderItemDto {
  @IsEnum(CreateOrderItemType) type!: CreateOrderItemType;
  @IsOptional() @IsUUID() productId?: string;
  @IsOptional() @IsUUID() serviceId?: string;
  @Type(() => Number) @IsInt() @Min(1) quantity!: number;
}
export class CreateOrderDto {
  @IsString() @IsNotEmpty() @MaxLength(100) name!: string;
  @IsEmail() email!: string;
  @IsOptional() @IsString() @MaxLength(20) phone?: string;
  @IsString() @IsNotEmpty() address!: string;
  @IsString() @IsNotEmpty() city!: string;
  @IsString() @IsNotEmpty() state!: string;
  @IsString() @IsNotEmpty() country!: string;
  @IsString() @IsNotEmpty() postalCode!: string;
  @IsOptional() @IsString() @MaxLength(3) currency?: string;
  @IsArray() @ValidateNested({ each: true }) @Type(() => CreateOrderItemDto) items!: CreateOrderItemDto[];
}
