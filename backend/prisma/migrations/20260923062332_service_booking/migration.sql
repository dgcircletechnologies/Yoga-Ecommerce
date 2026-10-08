-- The index depends on this column. Keep this migration safe when it is
-- applied before the later service-bookings migration.
ALTER TABLE "Service" ADD COLUMN IF NOT EXISTS "trainerId" TEXT;

-- CreateIndex
CREATE INDEX IF NOT EXISTS "Service_trainerId_idx" ON "Service"("trainerId");
