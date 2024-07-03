/*
  Warnings:

  - You are about to drop the column `productIds` on the `Plan` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Plan" DROP COLUMN "productIds";

-- CreateTable
CREATE TABLE "_PlanToProduct" (
    "A" INTEGER NOT NULL,
    "B" BIGINT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_PlanToProduct_AB_unique" ON "_PlanToProduct"("A", "B");

-- CreateIndex
CREATE INDEX "_PlanToProduct_B_index" ON "_PlanToProduct"("B");

-- AddForeignKey
ALTER TABLE "_PlanToProduct" ADD CONSTRAINT "_PlanToProduct_A_fkey" FOREIGN KEY ("A") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlanToProduct" ADD CONSTRAINT "_PlanToProduct_B_fkey" FOREIGN KEY ("B") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
