ALTER TABLE "Payment" ADD COLUMN "razorpayOrderId" TEXT;
ALTER TABLE "Payment" ADD COLUMN "razorpayPaymentId" TEXT;
ALTER TABLE "Payment" ADD COLUMN "razorpaySignature" TEXT;
ALTER TABLE "Payment" ADD COLUMN "failureReason" TEXT;
ALTER TABLE "Payment" ADD COLUMN "gatewayMetadata" JSONB;
CREATE UNIQUE INDEX "Payment_razorpayOrderId_key" ON "Payment"("razorpayOrderId");
CREATE UNIQUE INDEX "Payment_razorpayPaymentId_key" ON "Payment"("razorpayPaymentId");
