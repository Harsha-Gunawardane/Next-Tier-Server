-- CreateEnum
CREATE TYPE "course_visibility" AS ENUM ('PUBLIC', 'PRIVATE');

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "announcements" JSONB[] DEFAULT ARRAY[]::JSONB[],
ADD COLUMN     "visibility" "course_visibility" NOT NULL DEFAULT 'PRIVATE';

-- AlterTable
ALTER TABLE "study_pack" ADD COLUMN     "public_ids" JSONB[] DEFAULT ARRAY[]::JSONB[],
ADD COLUMN     "visibility" "visibility" NOT NULL DEFAULT 'PRIVATE';
