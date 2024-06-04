export class InvoicePDFParamsDto {
  pdfFilePath: string;
  barcodeFilePath: string;
  invoice: {
    code: string;
    amountPaid: number;
    createdAt: Date;
    command: {
      code: string;
      withdrawDate: Date;
      discount: number;
      advance: number;
      user: {
        username: string;
        phone: number;
        address: string;
      };
      customer: {
        phone: number;
        address: string;
        name: string;
      };
      services: {
        quantity: number;
        service: {
          label: string;
          price: number;
        };
      }[];
    };
  };
}
