/*
  Warnings:

  - A unique constraint covering the columns `[currentVersionId]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Service_currentVersionId_key" ON "Service"("currentVersionId");

-- AddForeignKey
ALTER TABLE "Service" ADD CONSTRAINT "Service_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "ServiceVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
