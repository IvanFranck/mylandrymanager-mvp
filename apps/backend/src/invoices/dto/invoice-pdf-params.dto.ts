export class InvoicePDFParamsDto {
  pdfFilePath: string;
  barcodeFilePath: string;
  invoice: {
    code: string;
    advance: number;
    createdAt: Date;
    command: {
      code: string;
      withdrawDate: Date;
      discount: number;
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
