-- DropForeignKey
ALTER TABLE "student_attendance" DROP CONSTRAINT "student_attendance_student_id_fkey";

-- AddForeignKey
ALTER TABLE "student_attendance" ADD CONSTRAINT "student_attendance_student_id_fkey" FOREIGN KEY ("student_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;
