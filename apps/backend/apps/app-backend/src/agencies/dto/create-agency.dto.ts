import { ApiProperty } from '@nestjs/swagger';
import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';

export class CreateAgencyDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty({ example: 123456789, description: 'Agency contact' })
  @IsOptional()
  @IsPhoneNumber('CM')
  phone?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  address?: string;
}
