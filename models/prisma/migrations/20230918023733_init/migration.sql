-- CreateTable
CREATE TABLE "papers" (
    "paper_id" TEXT NOT NULL,
    "course_id" TEXT DEFAULT '',
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "subject" TEXT,
    "subject_areas" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "papers_pkey" PRIMARY KEY ("paper_id")
);
