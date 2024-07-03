/*
  Warnings:

  - You are about to alter the column `planId` on the `UserPlan` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - A unique constraint covering the columns `[planId]` on the table `UserPlan` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "UserPlan" ALTER COLUMN "planId" SET DATA TYPE INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "UserPlan_planId_key" ON "UserPlan"("planId");

-- AddForeignKey
ALTER TABLE "UserPlan" ADD CONSTRAINT "UserPlan_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
