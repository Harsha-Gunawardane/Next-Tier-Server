/*
  Warnings:

  - Added the required column `CASE WHEN resolved THEN 'RESOLVED' ELSE (CASE WHEN action = 'IGNORED' THEN 'IGNORED' ELSE 'PENDING' END) END` to the `complaints` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "complaints" ADD COLUMN     "CASE WHEN resolved THEN 'RESOLVED' ELSE (CASE WHEN action = 'IGNORED' THEN 'IGNORED' ELSE 'PENDING' END) END" TEXT NOT NULL,
ALTER COLUMN "action" SET DEFAULT '';
