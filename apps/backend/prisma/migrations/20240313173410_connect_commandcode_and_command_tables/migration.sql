/*
  Warnings:

  - You are about to drop the column `code` on the `Command` table. All the data in the column will be lost.
  - You are about to drop the column `withdrawDate` on the `Command` table. All the data in the column will be lost.
  - You are about to alter the column `code` on the `CommandsCode` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(8)`.
  - A unique constraint covering the columns `[commandId]` on the table `CommandsCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `commandId` to the `CommandsCode` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Command_code_key";

-- AlterTable
ALTER TABLE "Command" DROP COLUMN "code",
DROP COLUMN "withdrawDate";

-- AlterTable
ALTER TABLE "CommandsCode" ADD COLUMN     "commandId" INTEGER NOT NULL,
ALTER COLUMN "code" SET DATA TYPE VARCHAR(8);

-- CreateIndex
CREATE UNIQUE INDEX "CommandsCode_commandId_key" ON "CommandsCode"("commandId");

-- AddForeignKey
ALTER TABLE "CommandsCode" ADD CONSTRAINT "CommandsCode_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "Command"("id") ON DELETE CASCADE ON UPDATE CASCADE;
