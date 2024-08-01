import { IsNotEmpty, IsNumber } from 'class-validator';

export class CreateInvoiceDTO {
  @IsNumber()
  @IsNotEmpty()
  commandId: number;

  @IsNumber()
  @IsNotEmpty()
  advance: number;
}
