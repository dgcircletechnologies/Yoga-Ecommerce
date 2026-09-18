ALTER TABLE "Service" DROP CONSTRAINT IF EXISTS "Service_categoryId_fkey";
DROP INDEX IF EXISTS "Service_categoryId_idx";
ALTER TABLE "Service" DROP COLUMN IF EXISTS "categoryId";
