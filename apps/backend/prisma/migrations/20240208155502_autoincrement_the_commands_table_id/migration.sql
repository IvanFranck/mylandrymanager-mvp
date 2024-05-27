-- AlterTable
CREATE SEQUENCE command_id_seq;
ALTER TABLE "Command" ALTER COLUMN "id" SET DEFAULT nextval('command_id_seq');
ALTER SEQUENCE command_id_seq OWNED BY "Command"."id";
