export class InvoicePDFParamsDto {
  barcodeBuffer: Buffer;
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
        phone: string;
        address: string;
      };
      customer: {
        phone: string;
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
