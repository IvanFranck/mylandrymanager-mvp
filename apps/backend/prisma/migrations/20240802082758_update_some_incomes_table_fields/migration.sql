/*
  Warnings:

  - You are about to drop the column `amountPaid` on the `Incomes` table. All the data in the column will be lost.
  - Added the required column `amount` to the `Incomes` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Incomes" DROP COLUMN "amountPaid",
ADD COLUMN     "amount" INTEGER NOT NULL;
