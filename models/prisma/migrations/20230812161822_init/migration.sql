/*
  Warnings:

  - You are about to drop the column `CASE WHEN resolved = true THEN 'RESOLVED' ELSE CASE WHEN action` on the `complaints` table. All the data in the column will be lost.
  - You are about to drop the column `resolved` on the `complaints` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "ComplaintStatus" AS ENUM ('PENDING', 'RESOLVED', 'IGNORED');

-- AlterTable
ALTER TABLE "complaints" DROP COLUMN "CASE WHEN resolved = true THEN 'RESOLVED' ELSE CASE WHEN action",
DROP COLUMN "resolved",
ADD COLUMN     "status" "ComplaintStatus" NOT NULL DEFAULT 'PENDING';
