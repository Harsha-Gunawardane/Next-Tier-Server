-- CreateTable
CREATE TABLE "institute_staff" (
    "staff_id" TEXT NOT NULL,
    "emergency_No" TEXT,
    "qualifications" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "institute_staff_pkey" PRIMARY KEY ("staff_id")
);

-- AddForeignKey
ALTER TABLE "institute_staff" ADD CONSTRAINT "institute_staff_staff_id_fkey" FOREIGN KEY ("staff_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
