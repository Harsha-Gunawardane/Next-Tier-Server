/*
  Warnings:

  - You are about to drop the column `status` on the `tutor` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tutor" DROP COLUMN "status";

-- DropEnum
DROP TYPE "tutor_status";
