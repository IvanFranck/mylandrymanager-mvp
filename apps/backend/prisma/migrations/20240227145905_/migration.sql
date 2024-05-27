/*
  Warnings:

  - A unique constraint covering the columns `[code]` on the table `Command` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `code` to the `Command` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Command" ADD COLUMN     "code" VARCHAR(8) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Command_code_key" ON "Command"("code");
