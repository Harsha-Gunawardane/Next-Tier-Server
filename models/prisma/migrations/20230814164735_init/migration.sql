/*
  Warnings:

  - You are about to drop the column `resolved` on the `complaints` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('PENDING', 'RESOLVED', 'IGNORED');

-- AlterTable
ALTER TABLE "complaints" DROP COLUMN "resolved",
ADD COLUMN     "action" TEXT DEFAULT '',
ADD COLUMN     "status" "ComplaintStatus" NOT NULL DEFAULT 'PENDING';

-- CreateTable
CREATE TABLE "instStaff" (
    "inst_staff_id" TEXT NOT NULL,
    "qualifications" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "instStaff_pkey" PRIMARY KEY ("inst_staff_id")
);

-- AddForeignKey
ALTER TABLE "instStaff" ADD CONSTRAINT "instStaff_inst_staff_id_fkey" FOREIGN KEY ("inst_staff_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
