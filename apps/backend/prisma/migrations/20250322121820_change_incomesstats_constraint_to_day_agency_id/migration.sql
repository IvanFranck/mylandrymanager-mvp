/*
  Warnings:

  - A unique constraint covering the columns `[day,agencyId]` on the table `IncomesStats` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "IncomesStats_day_accountId_key";

-- CreateIndex
CREATE UNIQUE INDEX "IncomesStats_day_agencyId_key" ON "IncomesStats"("day", "agencyId");
