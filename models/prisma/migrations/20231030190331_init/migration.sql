/*
  Warnings:

  - Made the column `monthly_fee` on table `courses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "monthly_fee" SET NOT NULL;
