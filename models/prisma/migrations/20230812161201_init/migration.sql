/*
  Warnings:

  - You are about to drop the column `CASE WHEN resolved THEN 'RESOLVED' ELSE (CASE WHEN action = 'IG` on the `complaints` table. All the data in the column will be lost.
  - Added the required column `CASE WHEN resolved = true THEN 'RESOLVED' ELSE CASE WHEN action = 'IGNORED' THEN 'IGNORED' ELSE 'PENDING' END END` to the `complaints` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "complaints" DROP COLUMN "CASE WHEN resolved THEN 'RESOLVED' ELSE (CASE WHEN action = 'IG",
ADD COLUMN     "CASE WHEN resolved = true THEN 'RESOLVED' ELSE CASE WHEN action = 'IGNORED' THEN 'IGNORED' ELSE 'PENDING' END END" TEXT NOT NULL;
