CREATE TYPE "ServiceBookingImageReviewStatus" AS ENUM ('NOT_UPLOADED', 'PENDING', 'REVIEWED', 'REJECTED');
CREATE TYPE "ServiceBookingAdminReviewStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');
CREATE TYPE "ServiceBookingActorType" AS ENUM ('SYSTEM', 'CUSTOMER', 'TRAINER', 'ADMIN');

ALTER TABLE "ServiceBooking"
  ADD COLUMN IF NOT EXISTS "imageReviewStatus" "ServiceBookingImageReviewStatus" NOT NULL DEFAULT 'NOT_UPLOADED',
  ADD COLUMN IF NOT EXISTS "imageReviewedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "imageReviewedBy" TEXT,
  ADD COLUMN IF NOT EXISTS "imageRejectionReason" TEXT,
  ADD COLUMN IF NOT EXISTS "adminReviewStatus" "ServiceBookingAdminReviewStatus" NOT NULL DEFAULT 'PENDING',
  ADD COLUMN IF NOT EXISTS "adminReviewedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "adminReviewedBy" TEXT,
  ADD COLUMN IF NOT EXISTS "adminRejectionReason" TEXT;

UPDATE "ServiceBooking"
SET "imageReviewStatus" = 'PENDING'
WHERE jsonb_typeof("sceneImages") = 'array' AND jsonb_array_length("sceneImages") > 0;

CREATE TABLE "ServiceBookingAction" (
  "id" TEXT NOT NULL,
  "bookingId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "performedBy" TEXT,
  "actorType" "ServiceBookingActorType" NOT NULL,
  "description" TEXT NOT NULL,
  "metadata" JSONB,
  "performedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ServiceBookingAction_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "ServiceBookingAction_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "ServiceBooking"("id") ON DELETE CASCADE ON UPDATE CASCADE
);
CREATE INDEX "ServiceBookingAction_bookingId_performedAt_idx" ON "ServiceBookingAction"("bookingId", "performedAt");
