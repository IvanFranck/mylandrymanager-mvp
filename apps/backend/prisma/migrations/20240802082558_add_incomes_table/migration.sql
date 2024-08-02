-- CreateTable
CREATE TABLE "Incomes" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "commandId" INTEGER NOT NULL,
    "amountPaid" INTEGER NOT NULL DEFAULT 0,
    "incomesStatsDay" TEXT,
    "incomesStatsAccountId" INTEGER,

    CONSTRAINT "Incomes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Incomes" ADD CONSTRAINT "Incomes_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "Command"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Incomes" ADD CONSTRAINT "Incomes_incomesStatsDay_incomesStatsAccountId_fkey" FOREIGN KEY ("incomesStatsDay", "incomesStatsAccountId") REFERENCES "IncomesStats"("day", "accountId") ON DELETE SET NULL ON UPDATE CASCADE;
