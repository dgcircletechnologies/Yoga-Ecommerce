ALTER TABLE "ServiceBooking" ADD COLUMN IF NOT EXISTS "sceneImages" JSONB NOT NULL DEFAULT '[]'::jsonb;
