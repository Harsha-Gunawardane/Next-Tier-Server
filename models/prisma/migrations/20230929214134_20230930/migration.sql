-- AlterTable
ALTER TABLE "content" ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "type" SET DEFAULT 'VIDEO',
ALTER COLUMN "subject" SET DEFAULT '',
ALTER COLUMN "subject_areas" SET DEFAULT ARRAY[]::TEXT[],
ALTER COLUMN "thumbnail" SET DEFAULT '';

-- CreateTable
CREATE TABLE "student_follow_tutor" (
    "student_id" TEXT NOT NULL,
    "tutor_id" TEXT NOT NULL,

    CONSTRAINT "student_follow_tutor_pkey" PRIMARY KEY ("student_id","tutor_id")
);

-- AddForeignKey
ALTER TABLE "student_follow_tutor" ADD CONSTRAINT "student_follow_tutor_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_follow_tutor" ADD CONSTRAINT "student_follow_tutor_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("tutor_id") ON DELETE RESTRICT ON UPDATE CASCADE;
