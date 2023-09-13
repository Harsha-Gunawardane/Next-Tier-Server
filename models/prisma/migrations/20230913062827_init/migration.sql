/*
  Warnings:

  - You are about to drop the column `days` on the `reading_schedule` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `reading_schedule` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "reading_schedule" DROP COLUMN "days",
DROP COLUMN "message",
ADD COLUMN     "schedule" JSONB NOT NULL DEFAULT '{}';
