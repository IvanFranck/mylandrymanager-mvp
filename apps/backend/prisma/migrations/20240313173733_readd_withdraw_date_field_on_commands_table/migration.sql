/*
  Warnings:

  - Added the required column `withdrawDate` to the `Command` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Command" ADD COLUMN     "withdrawDate" TIMESTAMP(3) NOT NULL;
