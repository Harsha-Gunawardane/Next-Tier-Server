-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'PAID', 'FAILED', 'EXTENDED');

-- AlterTable
ALTER TABLE "student_purchase_studypack" ADD COLUMN     "status" "payment_status" NOT NULL DEFAULT 'PENDING';
