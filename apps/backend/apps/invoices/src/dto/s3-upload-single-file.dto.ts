export type S3UploadSingleFileDTO = {
  file: Buffer;
  invoiceCreatedAt: Date;
  invoiceId: number;
  agencyId: number;
  customerId: number;
  commandId: number;
  invoiceCode: string;
};
