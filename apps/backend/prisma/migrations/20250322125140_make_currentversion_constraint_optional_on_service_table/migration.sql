-- DropForeignKey
ALTER TABLE "Service" DROP CONSTRAINT "Service_currentVersionId_fkey";

-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "currentVersionId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "ServiceVersion"("id") ON DELETE SET NULL ON UPDATE CASCADE;
