import { Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, IsUrl, MaxLength, Min } from 'class-validator';
export class UpdateServiceDto {
  @IsOptional() @IsString() @MaxLength(150) name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) price?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) sessions?: number;
  @IsOptional() @IsString() @IsUrl({ protocols: ['http', 'https'], require_protocol: true }) imageUrl?: string;
  @IsOptional() @IsBoolean() status?: boolean;
}
