/*
  Warnings:

  - The `schedule_time` column on the `quiz` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "quiz" DROP COLUMN "schedule_time",
ADD COLUMN     "schedule_time" TIMESTAMP(3);
