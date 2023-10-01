/*
  Warnings:

  - Added the required column `email` to the `tutor` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "tutor" ADD COLUMN     "email" TEXT NOT NULL;
