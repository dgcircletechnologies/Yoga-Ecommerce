import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, IsUrl, IsUUID, MaxLength, Min } from 'class-validator';
export class UpdateServiceDto {
  @IsOptional() @IsString() @MaxLength(150) name?: string;
  @IsOptional() @IsString() description?: string;
  @IsOptional() @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) price?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) sessions?: number;
  @IsOptional() @IsUUID() trainerId?: string;
  @IsOptional() @Type(() => Boolean) @IsBoolean() removeImage?: boolean;
  @IsOptional() @IsUrl({ protocols: ['http', 'https'], require_protocol: true }) imageUrl?: string;
  @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean() status?: boolean;
}
