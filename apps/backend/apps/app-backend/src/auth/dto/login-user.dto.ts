import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    type: Number,
    minLength: 9,
    maxLength: 9,
  })
  @IsNotEmpty()
  @IsString()
  @IsPhoneNumber('CM')
  phone: string;

  @ApiProperty()
  @IsString()
  password: string;
}
