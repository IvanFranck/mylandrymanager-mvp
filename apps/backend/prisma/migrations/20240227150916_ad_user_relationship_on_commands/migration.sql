/*
  Warnings:

  - Added the required column `userId` to the `Command` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Command" ADD COLUMN     "userId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "Command" ADD CONSTRAINT "Command_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
