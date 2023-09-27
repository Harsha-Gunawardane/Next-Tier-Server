/*
  Warnings:

  - You are about to drop the column `start_date` on the `study_pack` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "study_pack" DROP COLUMN "start_date",
ADD COLUMN     "start" TEXT;
