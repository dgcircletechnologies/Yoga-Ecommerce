import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyServicePaymentDto {
  @IsString()
  @IsNotEmpty()
  checkoutToken!: string;

  @IsString()
  @IsNotEmpty()
  razorpayOrderId!: string;

  @IsString()
  @IsNotEmpty()
  razorpayPaymentId!: string;

  @IsString()
  @IsNotEmpty()
  razorpaySignature!: string;
}
