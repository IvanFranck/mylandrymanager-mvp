import { IsOptional, IsPhoneNumber, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'john_doe', description: 'Username of the user' })
  @IsOptional()
  @IsString()
  username?: string;

  @ApiProperty({ example: 123456789, description: 'Phone number of the user' })
  @IsOptional()
  @IsPhoneNumber('CM')
  phone?: string;
}
