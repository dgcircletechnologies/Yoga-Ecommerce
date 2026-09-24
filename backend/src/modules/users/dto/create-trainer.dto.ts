import { IsEmail, IsNotEmpty, IsOptional, IsString, IsUrl, Matches, MaxLength, MinLength } from 'class-validator';

export class CreateTrainerDto {
  @IsString() @IsNotEmpty() @MaxLength(100) name!: string;
  @IsEmail() email!: string;
  @IsString() @IsNotEmpty() @MinLength(8) @MaxLength(128) password!: string;
  @IsOptional() @IsString() @Matches(/^(?:\d{10}|\+[1-9]\d{7,14})$/, { message: 'phone must be a valid 10-digit or international phone number' }) phone?: string;
  @IsOptional() @IsString() @MaxLength(500) address?: string;
  @IsOptional() @IsUrl({ require_protocol: true }) @MaxLength(500) profileUrl?: string;
  @IsOptional() @IsString() @MaxLength(2000) aboutMe?: string;
  @IsOptional() @IsString() @MaxLength(100) experience?: string;
  @IsOptional() @IsString() @MaxLength(150) specialty?: string;
}
