export interface SendWhatsappTextMessageDto {
  type: 'invoice' | 'withdraw_reminder';
  to: string;
  invoiceCode: string;
}

export type OrderConfirmationTemplateData = {
  customer_name: string;
  order_id: string;
  agency_name: string;
  services_list: string;
  order_amount: string;
  withdrawal_date: string;
};
