UPDATE "Order" SET "status" = 'NEW'
WHERE "status" = 'PENDING'
  AND EXISTS (
    SELECT 1 FROM "OrderItem"
    WHERE "OrderItem"."orderId" = "Order"."id" AND "OrderItem"."type" = 'PRODUCT'
  )
  AND NOT EXISTS (
    SELECT 1 FROM "OrderItem"
    WHERE "OrderItem"."orderId" = "Order"."id" AND "OrderItem"."type" = 'SERVICE'
  );

UPDATE "Order" SET "status" = 'DELIVERED'
WHERE "status" = 'COMPLETED'
  AND EXISTS (
    SELECT 1 FROM "OrderItem"
    WHERE "OrderItem"."orderId" = "Order"."id" AND "OrderItem"."type" = 'PRODUCT'
  )
  AND NOT EXISTS (
    SELECT 1 FROM "OrderItem"
    WHERE "OrderItem"."orderId" = "Order"."id" AND "OrderItem"."type" = 'SERVICE'
  );
