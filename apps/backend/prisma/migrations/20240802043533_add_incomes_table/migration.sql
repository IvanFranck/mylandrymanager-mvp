-- CreateTable
CREATE TABLE "IncomesStats" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "day" TIMESTAMP(3) NOT NULL,
    "ammount" INTEGER NOT NULL,
    "accountId" INTEGER NOT NULL,

    CONSTRAINT "IncomesStats_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "IncomesStats" ADD CONSTRAINT "IncomesStats_accountId_fkey" FOREIGN KEY ("accountId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
