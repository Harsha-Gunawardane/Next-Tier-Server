-- AlterTable
ALTER TABLE "papers" ADD COLUMN     "subject" TEXT;

-- AlterTable
ALTER TABLE "student_marks" ALTER COLUMN "course_id" SET DEFAULT '',
ALTER COLUMN "marks" DROP NOT NULL;
