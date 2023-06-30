-- CreateTable
CREATE TABLE "employees" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,

    CONSTRAINT "employees_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "users" (
    "id" SERIAL NOT NULL,
    "username" TEXT NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone_number" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "address" TEXT,
    "NIC" TEXT,
    "join_date" TIMESTAMP(3) NOT NULL,
    "DOB" TIMESTAMP(3),
    "status" BOOLEAN NOT NULL DEFAULT true,
    "last_login" TIMESTAMP(3),
    "refresh_token" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "prefered_language" TEXT NOT NULL DEFAULT 'English',
    "verified" BOOLEAN NOT NULL DEFAULT false,
    "ptofile_picture" TEXT NOT NULL DEFAULT 'https://th.bing.com/th/id/R.bae2d37c4317140a408aef6671346186?rik=2DNeSZ%2fD0xtseQ&pid=ImgRaw&r=0',
    "roles" TEXT NOT NULL,

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_username_key" ON "users"("username");
