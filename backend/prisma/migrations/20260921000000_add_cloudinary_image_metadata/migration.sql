ALTER TABLE "Product" ADD COLUMN IF NOT EXISTS "imageUrl" VARCHAR(500), ADD COLUMN IF NOT EXISTS "imagePublicId" VARCHAR(255);
ALTER TABLE "Category" ADD COLUMN IF NOT EXISTS "imageUrl" VARCHAR(500), ADD COLUMN IF NOT EXISTS "imagePublicId" VARCHAR(255);
ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "imageUrl" VARCHAR(500), ADD COLUMN IF NOT EXISTS "imagePublicId" VARCHAR(255);

UPDATE "Product" SET "imageUrl" = NULLIF("images"[1], '') WHERE "images" IS NOT NULL AND cardinality("images") > 0;
UPDATE "Category" SET "imageUrl" = NULLIF("images"[1], '') WHERE "images" IS NOT NULL AND cardinality("images") > 0;
UPDATE "Service" SET "imageUrl" = NULLIF("images"[1], '') WHERE "images" IS NOT NULL AND cardinality("images") > 0;

ALTER TABLE "Product" DROP COLUMN IF EXISTS "images";
ALTER TABLE "Category" DROP COLUMN IF EXISTS "images";
ALTER TABLE "Service" DROP COLUMN IF EXISTS "images";
