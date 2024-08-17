export type S3UploadSingleFileDTO = {
  file: Buffer;
  fileKey: string;
  tagList: {
    customer: string;
    user: string;
    billId: string;
  };
  isPublic: boolean;
};
