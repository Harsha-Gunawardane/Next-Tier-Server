/*
  Warnings:

  - You are about to drop the column `user_id` on the `folders` table. All the data in the column will be lost.
  - Added the required column `user_name` to the `folders` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "folders" DROP CONSTRAINT "folders_user_id_fkey";

-- AlterTable
ALTER TABLE "folders" DROP COLUMN "user_id",
ADD COLUMN     "user_name" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "folders" ADD CONSTRAINT "folders_user_name_fkey" FOREIGN KEY ("user_name") REFERENCES "users"("username") ON DELETE RESTRICT ON UPDATE CASCADE;
