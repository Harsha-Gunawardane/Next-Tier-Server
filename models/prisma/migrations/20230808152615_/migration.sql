-- DropForeignKey
ALTER TABLE "staffOnTutor" DROP CONSTRAINT "staffOnTutor_staff_id_fkey";

-- DropForeignKey
ALTER TABLE "staffOnTutor" DROP CONSTRAINT "staffOnTutor_tutor_id_fkey";

-- DropForeignKey
ALTER TABLE "supporting_staff" DROP CONSTRAINT "supporting_staff_staff_id_fkey";

-- AddForeignKey
ALTER TABLE "supporting_staff" ADD CONSTRAINT "supporting_staff_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staffOnTutor" ADD CONSTRAINT "staffOnTutor_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "supporting_staff"("staff_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staffOnTutor" ADD CONSTRAINT "staffOnTutor_tutor_id_fkey" FOREIGN KEY ("tutor_id") REFERENCES "tutor"("tutor_id") ON DELETE CASCADE ON UPDATE CASCADE;
