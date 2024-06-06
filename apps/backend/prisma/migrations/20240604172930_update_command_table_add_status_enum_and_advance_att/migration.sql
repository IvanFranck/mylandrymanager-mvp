/*
  Warnings:

  - You are about to drop the column `advance` on the `Invoice` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CommandStatus" AS ENUM ('PENDING', 'PAID', 'NOT_PAID');

-- AlterTable
ALTER TABLE "Command" ADD COLUMN     "advance" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "status" "CommandStatus" NOT NULL DEFAULT 'NOT_PAID';

-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "advance",
ADD COLUMN     "amountPaid" INTEGER NOT NULL DEFAULT 0;
