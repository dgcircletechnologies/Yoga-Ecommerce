import { IsOptional, IsString, IsUrl, MaxLength } from 'class-validator';

export class UpdateCategoryDto {
  @IsOptional() @IsString() @MaxLength(100) name?: string;
  @IsOptional() @IsString() @MaxLength(500) description?: string;
  @IsOptional() @IsString() @MaxLength(500)
  @IsUrl({ protocols: ['http', 'https'], require_protocol: true }) imageUrl?: string;
}
