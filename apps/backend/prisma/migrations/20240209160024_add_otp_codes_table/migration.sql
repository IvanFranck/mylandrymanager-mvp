-- DropForeignKey
ALTER TABLE "Command" DROP CONSTRAINT "Command_customerId_fkey";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "signUpCompleted" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "OTPCode" (
    "id" SERIAL NOT NULL,
    "code" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "userId" INTEGER NOT NULL,

    CONSTRAINT "OTPCode_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "OTPCode" ADD CONSTRAINT "OTPCode_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Command" ADD CONSTRAINT "Command_customerId_fkey" FOREIGN KEY ("customerId") REFERENCES "Customer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
