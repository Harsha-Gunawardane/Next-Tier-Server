/*
  Warnings:

  - Made the column `thumbnail` on table `courses` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `number_of_questions` to the `quiz` table without a default value. This is not possible if the table is not empty.
  - Made the column `thumbnail` on table `study_pack` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_hall_id_fkey";

-- AlterTable
ALTER TABLE "content" ALTER COLUMN "type" DROP NOT NULL,
ALTER COLUMN "uploaded_at" DROP NOT NULL,
ALTER COLUMN "status" DROP NOT NULL,
ALTER COLUMN "file_path" DROP NOT NULL,
ALTER COLUMN "reactions" DROP NOT NULL;

-- AlterTable
ALTER TABLE "courses" ALTER COLUMN "thumbnail" SET NOT NULL,
ALTER COLUMN "hall_id" DROP NOT NULL;

-- AlterTable
ALTER TABLE "quiz" ADD COLUMN     "number_of_questions" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "study_pack" ALTER COLUMN "thumbnail" SET NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "email" TEXT;

-- CreateTable
CREATE TABLE "Admin" (
    "admin_id" TEXT NOT NULL,
    "emergency_No" TEXT NOT NULL,
    "admin_role" TEXT NOT NULL,
    "qualifications" TEXT[],

    CONSTRAINT "Admin_pkey" PRIMARY KEY ("admin_id")
);

-- AddForeignKey
ALTER TABLE "Admin" ADD CONSTRAINT "Admin_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "courses" ADD CONSTRAINT "courses_hall_id_fkey" FOREIGN KEY ("hall_id") REFERENCES "halls"("id") ON DELETE SET NULL ON UPDATE CASCADE;
