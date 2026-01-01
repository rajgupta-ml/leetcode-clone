-- CreateIndex
CREATE INDEX "RefreshToken_userId_idx" ON "RefreshToken" USING HASH ("userId");
