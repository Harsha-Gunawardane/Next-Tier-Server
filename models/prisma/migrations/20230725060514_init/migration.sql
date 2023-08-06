-- AlterTable
ALTER TABLE "content" ALTER COLUMN "uploaded_at" DROP NOT NULL,
ALTER COLUMN "file_path" DROP NOT NULL,
ALTER COLUMN "reactions" DROP NOT NULL;
