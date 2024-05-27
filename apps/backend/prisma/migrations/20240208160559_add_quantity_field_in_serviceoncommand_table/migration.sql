/*
  Warnings:

  - Added the required column `quantity` to the `ServiceOnCommand` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ServiceOnCommand" ADD COLUMN     "quantity" INTEGER NOT NULL;
