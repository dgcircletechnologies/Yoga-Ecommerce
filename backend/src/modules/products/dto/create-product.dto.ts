import { Transform, Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';
export class CreateProductDto {
  @IsString() @IsNotEmpty() @MaxLength(150) name!: string;
  @IsOptional() @IsString() description?: string;
  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) price!: number;
  @IsString() @IsNotEmpty() categoryId!: string;
  @Transform(({ value }) => value === undefined ? value : Array.isArray(value) ? value : [value])
  @IsOptional() @IsArray() @IsString({ each: true }) @MaxLength(50, { each: true }) tags?: string[];
  // Images are uploaded as multipart files. A URL is only a legacy/fallback
  // input, so an omitted or blank URL must not make product creation fail.
  @Transform(({ value }) => value === '' ? undefined : value)
  @IsOptional() @IsUrl({ protocols: ['http', 'https'], require_protocol: true }) imageUrl?: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) stock?: number;
  @IsOptional() @Type(() => Boolean) @IsBoolean() available?: boolean;
  @IsOptional() @Transform(({ value }) => value === true || value === false ? value : value === 'true' ? true : value === 'false' ? false : value) @IsBoolean() shippingIncluded?: boolean;
  @IsOptional() @Transform(({ value }) => value === true || value === false ? value : value === 'true' ? true : value === 'false' ? false : value) @IsBoolean() taxIncluded?: boolean;

  // Physical specifications
  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? undefined : Number(value))
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 3 })
  @Min(0.001)
  weight?: number;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? undefined : String(value).trim().toLowerCase())
  @IsString()
  @MaxLength(20)
  weightUnit?: string;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? undefined : Number(value))
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  length?: number;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? undefined : Number(value))
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  width?: number;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? undefined : Number(value))
  @Type(() => Number)
  @IsNumber({ maxDecimalPlaces: 2 })
  @Min(0.01)
  height?: number;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? undefined : String(value).trim().toLowerCase())
  @IsString()
  @MaxLength(20)
  dimensionUnit?: string;

  // Additional specifications
  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? undefined : String(value).trim())
  @IsString()
  @MaxLength(150)
  material?: string;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? undefined : String(value).trim())
  @IsString()
  @MaxLength(100)
  color?: string;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? undefined : String(value).trim())
  @IsString()
  @MaxLength(150)
  manufacturer?: string;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? undefined : String(value).trim())
  @IsString()
  @MaxLength(100)
  modelNumber?: string;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? undefined : String(value).trim())
  @IsString()
  @MaxLength(100)
  countryOfOrigin?: string;

  @IsOptional()
  @Transform(({ value }) => value === '' || value === null || value === undefined ? undefined : String(value).trim())
  @IsString()
  @MaxLength(1000)
  careInstructions?: string;
}
