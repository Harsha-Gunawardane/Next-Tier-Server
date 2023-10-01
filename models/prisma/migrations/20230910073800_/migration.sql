-- CreateTable
CREATE TABLE "papers" (
    "paper_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "subject_areas" TEXT[] DEFAULT ARRAY[]::TEXT[],

    CONSTRAINT "papers_pkey" PRIMARY KEY ("paper_id")
);
