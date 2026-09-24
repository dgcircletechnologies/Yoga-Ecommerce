import { IsNotEmpty, IsString, Matches } from 'class-validator';

export class ConfirmTrainerBookingDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{6}$/)
  otp!: string;
}
