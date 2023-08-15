-- CreateTable
CREATE TABLE "mcq_category" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "number_of_questions" INTEGER NOT NULL,
    "question_ids" TEXT[],

    CONSTRAINT "mcq_category_pkey" PRIMARY KEY ("id")
);
