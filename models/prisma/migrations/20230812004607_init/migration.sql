/*
  Warnings:

  - You are about to drop the `Admin` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Admin" DROP CONSTRAINT "Admin_admin_id_fkey";

-- DropTable
DROP TABLE "Admin";

-- CreateTable
CREATE TABLE "admin" (
    "admin_id" TEXT NOT NULL,
    "emergency_No" TEXT NOT NULL,
    "admin_role" TEXT NOT NULL,
    "qualifications" TEXT[],

    CONSTRAINT "admin_pkey" PRIMARY KEY ("admin_id")
);

-- AddForeignKey
ALTER TABLE "admin" ADD CONSTRAINT "admin_admin_id_fkey" FOREIGN KEY ("admin_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
