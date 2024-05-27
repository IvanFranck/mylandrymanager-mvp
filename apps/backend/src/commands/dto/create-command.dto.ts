import { ApiProperty } from '@nestjs/swagger';
import { Service } from '@prisma/client';
import {
  IsArray,
  IsISO8601,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

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

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  customerId: number;

  @ApiProperty()
  @IsNotEmpty()
  @IsArray()
  services: {
    service: Service;
    quantity: number;
  }[];
}
