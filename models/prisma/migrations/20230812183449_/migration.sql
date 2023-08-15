/*
  Warnings:

  - Added the required column `difficulty_level` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "questions" ADD COLUMN     "difficulty_level" TEXT NOT NULL;
