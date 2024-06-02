/*
  Warnings:

  - You are about to drop the column `signUpCompleted` on the `User` table. All the data in the column will be lost.
  - Added the required column `address` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "signUpCompleted",
ADD COLUMN     "address" VARCHAR(255) NOT NULL,
ADD COLUMN     "verified" TIMESTAMP(3);
