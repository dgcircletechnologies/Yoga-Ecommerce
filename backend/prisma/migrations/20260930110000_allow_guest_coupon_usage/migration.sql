-- Coupon usage may belong to a guest order with no authenticated user.
ALTER TABLE "CouponUsage" ALTER COLUMN "userId" DROP NOT NULL;
