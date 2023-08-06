/*
  Warnings:

  - Made the column `thumbnail` on table `study_pack` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "study_pack" ALTER COLUMN "thumbnail" SET NOT NULL;
