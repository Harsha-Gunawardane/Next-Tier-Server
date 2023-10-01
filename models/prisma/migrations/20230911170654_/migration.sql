-- CreateTable
CREATE TABLE "student_marks" (
    "student_id" TEXT NOT NULL,
    "paper_id" TEXT NOT NULL,
    "course_id" TEXT,
    "marks" INTEGER NOT NULL,

    CONSTRAINT "student_marks_pkey" PRIMARY KEY ("student_id","paper_id")
);

-- AddForeignKey
ALTER TABLE "student_marks" ADD CONSTRAINT "student_marks_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_marks" ADD CONSTRAINT "student_marks_paper_id_fkey" FOREIGN KEY ("paper_id") REFERENCES "papers"("paper_id") ON DELETE RESTRICT ON UPDATE CASCADE;
