/*
  Warnings:

  - The primary key for the `student_purchase_studypack` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `student_purchase_studypack` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- CreateEnum
CREATE TYPE "payment_status" AS ENUM ('PENDING', 'PAID', 'FAILED');

-- CreateEnum
CREATE TYPE "payment_for" AS ENUM ('EXTEND', 'PURCHASE');

-- AlterTable
ALTER TABLE "student_purchase_studypack" DROP CONSTRAINT "student_purchase_studypack_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD COLUMN     "payment_for" "payment_for" NOT NULL DEFAULT 'PURCHASE',
ADD COLUMN     "status" "payment_status" NOT NULL DEFAULT 'PENDING',
ADD CONSTRAINT "student_purchase_studypack_pkey" PRIMARY KEY ("id");
