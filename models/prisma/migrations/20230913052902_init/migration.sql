-- CreateTable
CREATE TABLE "reading_schedule" (
    "id" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "days" TEXT[],
    "user_id" TEXT NOT NULL,

    CONSTRAINT "reading_schedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reading_schedule" ADD CONSTRAINT "reading_schedule_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
