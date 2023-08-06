-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_hall_id_fkey";

-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "hall_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE SET NULL ON UPDATE CASCADE;
