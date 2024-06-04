/*
  Warnings:

  - You are about to drop the column `currentVersionId` on the `Service` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Service" DROP COLUMN "currentVersionId",
ADD COLUMN     "currentVersion" INTEGER;
