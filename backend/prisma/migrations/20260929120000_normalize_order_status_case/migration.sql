-- Normalize legacy order statuses and history values so status comparisons are
-- consistent while retaining custom status names and punctuation.
UPDATE "Order"
SET "status" = LOWER(BTRIM("status"));

UPDATE "OrderStatusHistory"
SET "fromStatus" = CASE WHEN "fromStatus" IS NULL THEN NULL ELSE LOWER(BTRIM("fromStatus")) END,
    "toStatus" = LOWER(BTRIM("toStatus"));
