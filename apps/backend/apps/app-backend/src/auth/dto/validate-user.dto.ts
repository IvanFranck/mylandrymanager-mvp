import { IsNotEmpty, IsPhoneNumber, IsString } from 'class-validator';

export class ValidateUserDto {
  @IsNotEmpty()
  @IsPhoneNumber('CM')
  phone: string;

  @IsNotEmpty()
  @IsString()
  password: string;
}
