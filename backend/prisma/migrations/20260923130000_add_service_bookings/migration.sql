ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "trainerId" TEXT;

DO $$ BEGIN
  CREATE TYPE "ServiceBookingStatus" AS ENUM ('PENDING_PAYMENT', 'PAID', 'SCHEDULED', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
DO $$ BEGIN
  CREATE TYPE "ServiceSessionStatus" AS ENUM ('SCHEDULED', 'CONFIRMED', 'COMPLETED', 'CANCELLED');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE IF NOT EXISTS "ServiceBooking" (
  "id" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "serviceId" TEXT NOT NULL,
  "trainerId" TEXT NOT NULL,
  "customerId" TEXT NOT NULL,
  "quantity" INTEGER NOT NULL,
  "pricePerSession" DECIMAL(10,2) NOT NULL,
  "totalAmount" DECIMAL(10,2) NOT NULL,
  "status" "ServiceBookingStatus" NOT NULL DEFAULT 'PENDING_PAYMENT',
  "address" TEXT NOT NULL,
  "city" TEXT NOT NULL,
  "state" TEXT NOT NULL,
  "country" TEXT NOT NULL,
  "postalCode" TEXT NOT NULL,
  "otpHash" TEXT,
  "otpExpiresAt" TIMESTAMP(3),
  "otpVerifiedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ServiceBooking_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ServiceBooking_orderId_key" ON "ServiceBooking"("orderId");
CREATE INDEX IF NOT EXISTS "ServiceBooking_trainerId_status_idx" ON "ServiceBooking"("trainerId", "status");
CREATE INDEX IF NOT EXISTS "ServiceBooking_customerId_createdAt_idx" ON "ServiceBooking"("customerId", "createdAt");
CREATE INDEX IF NOT EXISTS "ServiceBooking_serviceId_idx" ON "ServiceBooking"("serviceId");

CREATE TABLE IF NOT EXISTS "ServiceSession" (
  "id" TEXT NOT NULL,
  "bookingId" TEXT NOT NULL,
  "scheduledAt" TIMESTAMP(3) NOT NULL,
  "status" "ServiceSessionStatus" NOT NULL DEFAULT 'SCHEDULED',
  "completedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ServiceSession_pkey" PRIMARY KEY ("id")
);
CREATE UNIQUE INDEX IF NOT EXISTS "ServiceSession_bookingId_scheduledAt_key" ON "ServiceSession"("bookingId", "scheduledAt");
CREATE INDEX IF NOT EXISTS "ServiceSession_scheduledAt_idx" ON "ServiceSession"("scheduledAt");
CREATE INDEX IF NOT EXISTS "ServiceSession_bookingId_status_idx" ON "ServiceSession"("bookingId", "status");

ALTER TABLE "Service" ADD CONSTRAINT "Service_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ServiceBooking" ADD CONSTRAINT "ServiceBooking_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ServiceSession" ADD CONSTRAINT "ServiceSession_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "ServiceBooking"("id") ON DELETE CASCADE ON UPDATE CASCADE;
