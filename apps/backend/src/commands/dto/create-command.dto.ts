import { Service } from '@prisma/client';
import { IsArray, IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCommandDto {
  @IsOptional()
  description?: string;

  @IsOptional()
  @IsNumber()
  discount?: number;

  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @IsNotEmpty()
  @IsArray()
  services: {
    service: Service;
    quantity: number;
  }[];
}
