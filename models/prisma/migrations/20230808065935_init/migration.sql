-- AlterTable
ALTER TABLE "tutes" ADD COLUMN     "isUpload" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "local_url" TEXT;
