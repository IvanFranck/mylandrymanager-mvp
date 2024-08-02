/*
  Warnings:

  - You are about to drop the `CommandsCode` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[code]` on the table `Command` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Command` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "CommandsCode" DROP CONSTRAINT "CommandsCode_commandId_fkey";

-- AlterTable
ALTER TABLE "Command" ADD COLUMN     "code" VARCHAR(10) NOT NULL;

-- DropTable
DROP TABLE "CommandsCode";

-- CreateIndex
CREATE UNIQUE INDEX "Command_code_key" ON "Command"("code");
