-- CreateEnum
CREATE TYPE "ProfileLevel" AS ENUM ('noob', 'intermediate', 'advance', 'king');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "rating" INTEGER NOT NULL DEFAULT 0,
    "level" "ProfileLevel" NOT NULL DEFAULT 'noob',

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
