/*
  Warnings:

  - Added the required column `facilities` to the `halls` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hall_profile` to the `halls` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "halls" ADD COLUMN     "facilities" TEXT NOT NULL,
ADD COLUMN     "hall_profile" TEXT NOT NULL;
