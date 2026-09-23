import { Transform, Type } from 'class-transformer';
import { IsBoolean, IsInt, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl, IsUUID, MaxLength, Min } from 'class-validator';
export class CreateServiceDto {
  @IsString() @IsNotEmpty() @MaxLength(150) name!: string;
  @IsOptional() @IsString() description?: string;
  @Type(() => Number) @IsNumber({ maxDecimalPlaces: 2 }) @Min(0) price!: number;
  @Type(() => Number) @IsInt() @Min(1) sessions!: number;
  @IsUUID() trainerId!: string;
  @IsOptional() @IsUrl({ protocols: ['http', 'https'], require_protocol: true }) imageUrl?: string;
  @IsOptional() @Transform(({ value }) => value === true || value === 'true') @IsBoolean() status?: boolean;
}
