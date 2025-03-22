import {
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Username of the user' })
  @IsNotEmpty()
  username: string;

  @ApiProperty({ example: 'password123', description: 'Password of the user' })
  @IsNotEmpty()
  password: string;

  @ApiProperty({ example: 123456789, description: 'Phone number of the user' })
  @IsNotEmpty()
  @IsPhoneNumber('CM')
  phone: string;

  @IsNotEmpty()
  @IsString()
  agency_name: string;

  @ApiProperty({ example: 123456789, description: 'Agency contact' })
  @IsOptional()
  @IsPhoneNumber('CM')
  agency_contact?: string;

  @IsOptional()
  @IsString()
  agency_address?: string;
}
