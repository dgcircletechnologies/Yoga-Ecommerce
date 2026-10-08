import { IsNotEmpty, IsString } from 'class-validator';

export class VerifyProductPaymentDto {
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
