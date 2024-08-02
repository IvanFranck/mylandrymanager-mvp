import { IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class ValidateUserDto {
  @IsNotEmpty()
  @IsNumber()
  phone: number;

  @IsNotEmpty()
  @IsString()
  password: string;
}
