-- CreateEnum
CREATE TYPE "Verdict" AS ENUM ('wrong', 'success', 'tle');

-- CreateEnum
CREATE TYPE "SupportedLanguages" AS ENUM ('c', 'cPlusPlus', 'python', 'java', 'javascript');

-- CreateTable
CREATE TABLE "Questions" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "question_title" TEXT NOT NULL,
    "question_rating" TEXT NOT NULL,
    "question_level" "ProfileLevel" NOT NULL,
    "testcase" TEXT[],
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Solutions" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "solution" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "language" "SupportedLanguages" NOT NULL,

    CONSTRAINT "Solutions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Submission" (
    "id" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "verdict" "Verdict" NOT NULL,
    "languagde" "SupportedLanguages" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Submission_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Solutions" ADD CONSTRAINT "Solutions_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Solutions" ADD CONSTRAINT "Solutions_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Questions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Submission" ADD CONSTRAINT "Submission_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
