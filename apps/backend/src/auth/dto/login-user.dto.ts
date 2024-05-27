import { ApiProperty } from '@nestjs/swagger';

export class LoginUserDto {
  @ApiProperty({
    type: Number,
    minLength: 9,
    maxLength: 9,
  })
  phone: number;

  @ApiProperty()
  password: string;
}
