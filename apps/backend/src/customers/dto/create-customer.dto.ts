import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional } from 'class-validator';

export class CreateCustomerDto {
  @ApiProperty({ example: 'Edouard', description: 'Nom du client' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 678394638,
    description: 'Numéro de téléphone du client',
  })
  @IsNumber()
  @IsNotEmpty()
  phone: number;

  @ApiProperty({
    example: 'Essos',
    description: 'Adresse du client',
    nullable: true,
  })
  @IsOptional()
  address?: string;
}
