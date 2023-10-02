-- CreateEnum
CREATE TYPE "available_status" AS ENUM ('AVAILABLE', 'PENDING', 'ERROR');

-- AlterTable
ALTER TABLE "content" ADD COLUMN     "available_status" "available_status" DEFAULT 'AVAILABLE';
