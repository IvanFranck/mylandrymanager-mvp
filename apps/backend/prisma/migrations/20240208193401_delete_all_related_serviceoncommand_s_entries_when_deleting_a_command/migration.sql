-- DropForeignKey
ALTER TABLE "ServiceOnCommand" DROP CONSTRAINT "ServiceOnCommand_commandId_fkey";

-- AddForeignKey
ALTER TABLE "ServiceOnCommand" ADD CONSTRAINT "ServiceOnCommand_commandId_fkey" FOREIGN KEY ("commandId") REFERENCES "Command"("id") ON DELETE CASCADE ON UPDATE CASCADE;
