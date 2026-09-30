-- Coupon schema. Coupon usage is recorded separately after successful payment.
DO $$ BEGIN
  CREATE TYPE "CouponDiscountType" AS ENUM ('PERCENTAGE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "CouponApplicableTo" AS ENUM ('PRODUCT', 'SERVICE', 'BOTH');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "CouponStatus" AS ENUM ('ACTIVE', 'INACTIVE');
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

CREATE TABLE "Coupon" (
  "id" TEXT NOT NULL,
  "code" VARCHAR(100) NOT NULL,
  "discountType" "CouponDiscountType" NOT NULL DEFAULT 'PERCENTAGE',
  "discountValue" DECIMAL(5,2) NOT NULL,
  "minimumAmount" DECIMAL(10,2),
  "applicableTo" "CouponApplicableTo" NOT NULL,
  "startDate" TIMESTAMP(3) NOT NULL,
  "expiryDate" TIMESTAMP(3) NOT NULL,
  "usageLimit" INTEGER,
  "usageCount" INTEGER NOT NULL DEFAULT 0,
  "status" "CouponStatus" NOT NULL DEFAULT 'ACTIVE',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Coupon_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "Coupon_discountValue_check" CHECK ("discountValue" > 0 AND "discountValue" <= 100),
  CONSTRAINT "Coupon_minimumAmount_check" CHECK ("minimumAmount" IS NULL OR "minimumAmount" >= 0),
  CONSTRAINT "Coupon_usageLimit_check" CHECK ("usageLimit" IS NULL OR "usageLimit" >= 0),
  CONSTRAINT "Coupon_usageCount_check" CHECK ("usageCount" >= 0),
  CONSTRAINT "Coupon_dateRange_check" CHECK ("expiryDate" >= "startDate")
);

CREATE UNIQUE INDEX "Coupon_code_key" ON "Coupon"("code");
CREATE UNIQUE INDEX "Coupon_code_case_insensitive_key" ON "Coupon"(LOWER("code"));
CREATE INDEX "Coupon_status_startDate_expiryDate_idx" ON "Coupon"("status", "startDate", "expiryDate");

ALTER TABLE "Order"
  ADD COLUMN "couponId" TEXT,
  ADD COLUMN "couponCode" VARCHAR(100),
  ADD COLUMN "couponDiscountType" "CouponDiscountType",
  ADD COLUMN "couponDiscountValue" DECIMAL(5,2),
  ADD COLUMN "couponDiscountAmount" DECIMAL(10,2),
  ADD CONSTRAINT "Order_couponDiscountValue_check" CHECK ("couponDiscountValue" IS NULL OR ("couponDiscountValue" > 0 AND "couponDiscountValue" <= 100)),
  ADD CONSTRAINT "Order_couponDiscountAmount_check" CHECK ("couponDiscountAmount" IS NULL OR "couponDiscountAmount" >= 0);

CREATE INDEX "Order_couponId_idx" ON "Order"("couponId");
ALTER TABLE "Order" ADD CONSTRAINT "Order_couponId_fkey"
  FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE TABLE "CouponUsage" (
  "id" TEXT NOT NULL,
  "couponId" TEXT NOT NULL,
  "orderId" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "discountAmount" DECIMAL(10,2) NOT NULL,
  "usedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CouponUsage_pkey" PRIMARY KEY ("id"),
  CONSTRAINT "CouponUsage_discountAmount_check" CHECK ("discountAmount" >= 0)
);

CREATE UNIQUE INDEX "CouponUsage_orderId_key" ON "CouponUsage"("orderId");
CREATE INDEX "CouponUsage_couponId_usedAt_idx" ON "CouponUsage"("couponId", "usedAt");
CREATE INDEX "CouponUsage_userId_usedAt_idx" ON "CouponUsage"("userId", "usedAt");

ALTER TABLE "CouponUsage" ADD CONSTRAINT "CouponUsage_couponId_fkey"
  FOREIGN KEY ("couponId") REFERENCES "Coupon"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CouponUsage" ADD CONSTRAINT "CouponUsage_orderId_fkey"
  FOREIGN KEY ("orderId") REFERENCES "Order"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "CouponUsage" ADD CONSTRAINT "CouponUsage_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
