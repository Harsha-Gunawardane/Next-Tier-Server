-- CreateEnum
CREATE TYPE "course_type" AS ENUM ('NORMAL', 'PAID');

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "content_ids" JSONB[];
