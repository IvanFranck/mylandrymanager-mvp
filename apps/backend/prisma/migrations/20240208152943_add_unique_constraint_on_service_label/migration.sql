/*
  Warnings:

  - A unique constraint covering the columns `[label]` on the table `Service` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Service_label_key" ON "Service"("label");
