/*
  Warnings:

  - A unique constraint covering the columns `[referrerId]` on the table `Referral` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[refereeId]` on the table `Referral` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[referrerId,refereeId]` on the table `Referral` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Referral_referrerId_key" ON "Referral"("referrerId");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_refereeId_key" ON "Referral"("refereeId");

-- CreateIndex
CREATE UNIQUE INDEX "Referral_referrerId_refereeId_key" ON "Referral"("referrerId", "refereeId");

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_refereeId_fkey" FOREIGN KEY ("refereeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
