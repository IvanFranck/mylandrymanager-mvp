export interface SendWhatsappTextMessageDto {
  type: 'invoice' | 'withdraw_reminder';
  to: string;
  invoiceCode: string;
}

export type OrderConfirmationTextMessageDto = {
  customer_name: string;
  order_id: string;
  agency_name: string;
  services_list: string;
  order_amount: string;
  withdrawal_date: string;
};

export type InvoiceMessageDto = {
  invoice_url: string;
  order_code: string;
  customer_name: string;
  agency_name: string;
  order_amount: string;
  order_status: string;
};
