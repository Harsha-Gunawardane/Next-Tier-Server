-- CreateTable
CREATE TABLE "parent" (
    "id" TEXT NOT NULL,
    "child_id" TEXT NOT NULL,

    CONSTRAINT "parent_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "parent_id_fkey" FOREIGN KEY ("id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "parent" ADD CONSTRAINT "parent_child_id_fkey" FOREIGN KEY ("child_id") REFERENCES "students"("student_id") ON DELETE RESTRICT ON UPDATE CASCADE;
