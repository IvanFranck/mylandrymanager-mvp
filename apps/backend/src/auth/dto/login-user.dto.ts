import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    type: Number,
    minLength: 9,
    maxLength: 9,
  })
  @IsInt()
  phone: number;

  @ApiProperty()
  @IsString()
  password: string;
}
