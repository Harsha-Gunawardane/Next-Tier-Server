/*
  Warnings:

  - You are about to drop the column `hell` on the `poll` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "poll" DROP COLUMN "hell",
ADD COLUMN     "user_id" TEXT[] DEFAULT ARRAY[]::TEXT[];
