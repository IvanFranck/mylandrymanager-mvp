/*
  Warnings:

  - You are about to drop the `CustomerOnCommand` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `customerId` to the `Command` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CustomerOnCommand" DROP CONSTRAINT "CustomerOnCommand_commandId_fkey";

-- DropForeignKey
ALTER TABLE "CustomerOnCommand" DROP CONSTRAINT "CustomerOnCommand_customerId_fkey";

-- AlterTable
ALTER TABLE "Command" ADD COLUMN     "customerId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "CustomerOnCommand";

-- AddForeignKey
ALTER TABLE "Command" ADD CONSTRAINT "Command_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
