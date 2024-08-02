/*
  Warnings:

  - You are about to drop the column `pathParam` on the `Invoice` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[fileName]` on the table `Invoice` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `fileName` to the `Invoice` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Invoice" DROP COLUMN "pathParam",
ADD COLUMN     "fileName" VARCHAR(36) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Invoice_fileName_key" ON "Invoice"("fileName");
