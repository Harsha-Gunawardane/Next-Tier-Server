/*
  Warnings:

  - You are about to drop the column `file_id` on the `tutes` table. All the data in the column will be lost.
  - You are about to drop the column `gcs_name` on the `tutes` table. All the data in the column will be lost.
  - You are about to drop the column `isUpload` on the `tutes` table. All the data in the column will be lost.
  - You are about to drop the column `local_url` on the `tutes` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `tutes` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tutes" DROP COLUMN "file_id",
DROP COLUMN "gcs_name",
DROP COLUMN "isUpload",
DROP COLUMN "local_url",
DROP COLUMN "url",
ADD COLUMN     "recent_activity" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
