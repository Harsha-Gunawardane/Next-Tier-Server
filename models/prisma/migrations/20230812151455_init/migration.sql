-- DropForeignKey
ALTER TABLE "quiz" DROP CONSTRAINT "quiz_course_id_fkey";

-- AlterTable
ALTER TABLE "quiz" ALTER COLUMN "course_id" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "quiz" ADD CONSTRAINT "quiz_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "courses"("id") ON DELETE SET NULL ON UPDATE CASCADE;
