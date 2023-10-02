/*
  Warnings:

  - The values [EXTENDED] on the enum `payment_status` will be removed. If these variants are still used in the database, this will fail.

*/
-- CreateEnum
CREATE TYPE "payment_for" AS ENUM ('EXTEND', 'PURCHASE');

-- AlterEnum
BEGIN;
CREATE TYPE "payment_status_new" AS ENUM ('PENDING', 'PAID', 'FAILED');
ALTER TABLE "student_purchase_studypack" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "student_purchase_studypack" ALTER COLUMN "status" TYPE "payment_status_new" USING ("status"::text::"payment_status_new");
ALTER TYPE "payment_status" RENAME TO "payment_status_old";
ALTER TYPE "payment_status_new" RENAME TO "payment_status";
DROP TYPE "payment_status_old";
ALTER TABLE "student_purchase_studypack" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterTable
ALTER TABLE "student_purchase_studypack" ADD COLUMN     "payment_for" "payment_for" NOT NULL DEFAULT 'PURCHASE';
