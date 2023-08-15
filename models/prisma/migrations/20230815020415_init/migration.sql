-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "content_ids" SET DEFAULT ARRAY[]::JSONB[];
