-- AlterTable
ALTER TABLE "users" ALTER COLUMN "refresh_token" DROP NOT NULL,
ALTER COLUMN "refresh_token" DROP DEFAULT,
ALTER COLUMN "refresh_token" SET DATA TYPE TEXT;
