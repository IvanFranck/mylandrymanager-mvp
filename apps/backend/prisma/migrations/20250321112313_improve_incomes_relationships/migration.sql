/*
  Warnings:

  - You are about to drop the column `incomesStatsAccountId` on the `Incomes` table. All the data in the column will be lost.
  - You are about to drop the column `incomesStatsDay` on the `Incomes` table. All the data in the column will be lost.
  - The primary key for the `IncomesStats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `amount` on the `IncomesStats` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[day,accountId]` on the table `IncomesStats` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `incomeStatsId` to the `Incomes` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Incomes" DROP CONSTRAINT "Incomes_incomesStatsDay_incomesStatsAccountId_fkey";

-- AlterTable
ALTER TABLE "Incomes" DROP COLUMN "incomesStatsAccountId",
DROP COLUMN "incomesStatsDay",
ADD COLUMN     "incomeStatsId" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "IncomesStats" DROP CONSTRAINT "IncomesStats_pkey",
DROP COLUMN "amount",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "IncomesStats_pkey" PRIMARY KEY ("id");

-- CreateIndex
CREATE UNIQUE INDEX "IncomesStats_day_accountId_key" ON "IncomesStats"("day", "accountId");

-- AddForeignKey
ALTER TABLE "Incomes" ADD CONSTRAINT "Incomes_incomeStatsId_fkey" FOREIGN KEY ("incomeStatsId") REFERENCES "IncomesStats"("id") ON DELETE CASCADE ON UPDATE CASCADE;
