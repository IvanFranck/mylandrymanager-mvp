/*
  Warnings:

  - You are about to drop the column `fileName` on the `Invoice` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "InvoiceStorageStatus" AS ENUM ('PENDING', 'UPLOADED', 'ERROR');

-- DropIndex
DROP INDEX "Invoice_fileName_key";

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "fileName",
ADD COLUMN     "s3key" TEXT,
ADD COLUMN     "storageStatus" "InvoiceStorageStatus" NOT NULL DEFAULT 'PENDING';
