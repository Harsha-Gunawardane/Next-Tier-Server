/*
  Warnings:

  - Made the column `thumbnail` on table `courses` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "thumbnail" SET NOT NULL;
