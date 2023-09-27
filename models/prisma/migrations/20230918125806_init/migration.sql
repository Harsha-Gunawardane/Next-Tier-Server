/*
  Warnings:

  - You are about to drop the column `user_id` on the `poll` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "poll" DROP COLUMN "user_id",
ADD COLUMN     "hell" TEXT;
