-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_currentDeviceId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "currentDeviceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_currentDeviceId_fkey" FOREIGN KEY ("currentDeviceId") REFERENCES "Device"("id") ON DELETE SET NULL ON UPDATE CASCADE;
