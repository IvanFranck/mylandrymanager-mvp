export interface SendWhatsappTextMessageDto {
  type: 'invoice' | 'withdraw_reminder';
  to: string;
  invoiceCode: string;
}
