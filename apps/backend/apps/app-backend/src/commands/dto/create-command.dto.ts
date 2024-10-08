import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export type CreateCommand_ServiceType = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  label: string;
  price: number;
  description?: string;
  currentVersionId: number;
};
export class CreateCommandDto {
  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  description?: string;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  discount?: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsISO8601({ strict: true })
  withdrawDate: Date;

  @ApiProperty({
    nullable: true,
  })
  @IsOptional()
  @IsNumber()
  advance?: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  services: {
    service: CreateCommand_ServiceType;
    quantity: number;
  }[];
}
