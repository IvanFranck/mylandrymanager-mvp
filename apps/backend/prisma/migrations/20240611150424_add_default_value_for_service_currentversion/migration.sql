/*
  Warnings:

  - Made the column `currentVersion` on table `Service` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Service" ALTER COLUMN "currentVersion" SET NOT NULL,
ALTER COLUMN "currentVersion" SET DEFAULT 1;
