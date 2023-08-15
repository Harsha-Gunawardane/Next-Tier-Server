/*
  Warnings:

  - Added the required column `type` to the `study_pack` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "study_pack_type" AS ENUM ('NORMAL', 'PAID');

-- AlterTable
ALTER TABLE "study_pack" ADD COLUMN     "type" "study_pack_type" NOT NULL;
