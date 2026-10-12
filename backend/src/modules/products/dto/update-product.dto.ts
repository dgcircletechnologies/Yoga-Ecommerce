import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';
export class UpdateProductDto {
  @IsOptional() @IsString() @MaxLength(150) name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) price?: number;
  @IsOptional() @IsString() categoryId?: string;
  @Transform(({ value }) => value === undefined ? value : Array.isArray(value) ? value : [value])
  @IsOptional() @IsArray() @IsString({ each: true }) @MaxLength(50, { each: true }) tags?: string[];
  @IsOptional() @Type(() => Boolean) @IsBoolean() removeImage?: boolean;
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsOptional() @IsUrl({ protocols: ['http', 'https'], require_protocol: true }) imageUrl?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) stock?: number;
  @IsOptional() @Type(() => Boolean) @IsBoolean() available?: boolean;
  @IsOptional() @Transform(({ value }) => value === true || value === false ? value : value === 'true' ? true : value === 'false' ? false : value) @IsBoolean() shippingIncluded?: boolean;
  @IsOptional() @Transform(({ value }) => value === true || value === false ? value : value === 'true' ? true : value === 'false' ? false : value) @IsBoolean() taxIncluded?: boolean;

  // Physical specifications
  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : Number(value))
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  weight?: number | null;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : String(value).trim().toLowerCase())
  @IsString()
  @MaxLength(20)
  weightUnit?: string | null;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : Number(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  length?: number | null;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : Number(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  width?: number | null;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : Number(value))
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  height?: number | null;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : String(value).trim().toLowerCase())
  @IsString()
  @MaxLength(20)
  dimensionUnit?: string | null;

  // Additional specifications
  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : String(value).trim())
  @IsString()
  @MaxLength(150)
  material?: string | null;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : String(value).trim())
  @IsString()
  @MaxLength(100)
  color?: string | null;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : String(value).trim())
  @IsString()
  @MaxLength(150)
  manufacturer?: string | null;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : String(value).trim())
  @IsString()
  @MaxLength(100)
  modelNumber?: string | null;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : String(value).trim())
  @IsString()
  @MaxLength(100)
  countryOfOrigin?: string | null;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === 'null' ? null : value === undefined ? undefined : String(value).trim())
  @IsString()
  @MaxLength(1000)
  careInstructions?: string | null;
}
