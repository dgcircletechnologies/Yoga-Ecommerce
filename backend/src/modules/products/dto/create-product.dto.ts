import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';
export class CreateProductDto {
  @IsString() @IsNotEmpty() @MaxLength(150) name!: string;
  @IsOptional() @IsString() description?: string;
  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) price!: number;
  @IsString() @IsNotEmpty() categoryId!: string;
  @IsOptional() @IsArray() @IsString({ each: true }) @MaxLength(50, { each: true }) tags?: string[];
  @IsString() @IsNotEmpty() @IsUrl({ protocols: ['http', 'https'], require_protocol: true }) imageUrl!: string;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) stock?: number;
  @IsOptional() @Type(() => Boolean) @IsBoolean() available?: boolean;
}
