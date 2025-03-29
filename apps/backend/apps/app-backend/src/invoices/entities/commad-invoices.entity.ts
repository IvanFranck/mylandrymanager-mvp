import { Invoice } from '@prisma/client';

export type CommandInvoicesEntity = Invoice & {
  url: string;
};
