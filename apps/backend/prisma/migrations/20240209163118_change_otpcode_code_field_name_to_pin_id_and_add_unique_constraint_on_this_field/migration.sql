/*
  Warnings:

  - You are about to drop the column `code` on the `OTPCode` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[pinId]` on the table `OTPCode` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `pinId` to the `OTPCode` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "OTPCode" DROP COLUMN "code",
ADD COLUMN     "pinId" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "OTPCode_pinId_key" ON "OTPCode"("pinId");
