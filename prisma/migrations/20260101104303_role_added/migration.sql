-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('admin', 'student');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "role" "UserRole" NOT NULL DEFAULT 'student';

-- CreateIndex
CREATE INDEX "RefreshToken_token_idx" ON "RefreshToken"("token");
