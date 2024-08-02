/*
  Warnings:

  - The primary key for the `IncomesStats` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `IncomesStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "IncomesStats" DROP CONSTRAINT "IncomesStats_pkey",
DROP COLUMN "id",
ALTER COLUMN "day" SET DATA TYPE TEXT,
ADD CONSTRAINT "IncomesStats_pkey" PRIMARY KEY ("day", "accountId");
