-- CreateEnum
CREATE TYPE "course_status" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- AlterTable
ALTER TABLE "courses" ADD COLUMN     "status" "course_status" NOT NULL DEFAULT 'PENDING';
