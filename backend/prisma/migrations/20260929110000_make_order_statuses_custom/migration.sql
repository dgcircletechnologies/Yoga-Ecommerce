-- Allow order statuses to be arbitrary strings instead of enum values.
ALTER TABLE "Order" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Order"
  ALTER COLUMN "status" TYPE TEXT
  USING "status"::text;
ALTER TABLE "Order" ALTER COLUMN "status" SET DEFAULT 'new';

-- Preserve existing history rows while reducing the model to the required
-- immutable status transition fields.
ALTER TABLE "OrderStatusHistory" ALTER COLUMN "previousStatus" TYPE TEXT USING "previousStatus"::text;
ALTER TABLE "OrderStatusHistory" ALTER COLUMN "newStatus" TYPE TEXT USING "newStatus"::text;
ALTER TABLE "OrderStatusHistory" RENAME COLUMN "previousStatus" TO "fromStatus";
ALTER TABLE "OrderStatusHistory" RENAME COLUMN "newStatus" TO "toStatus";
ALTER TABLE "OrderStatusHistory" RENAME COLUMN "changedAt" TO "createdAt";
ALTER TABLE "OrderStatusHistory" DROP COLUMN "changedBy";
ALTER TABLE "OrderStatusHistory" DROP COLUMN "actorType";
ALTER TABLE "OrderStatusHistory" DROP COLUMN "reason";
ALTER TABLE "OrderStatusHistory" DROP COLUMN "metadata";

DROP INDEX "OrderStatusHistory_orderId_changedAt_idx";
CREATE INDEX "OrderStatusHistory_orderId_createdAt_idx" ON "OrderStatusHistory"("orderId", "createdAt");

DROP TYPE "OrderHistoryActorType";
DROP TYPE "OrderStatus";
