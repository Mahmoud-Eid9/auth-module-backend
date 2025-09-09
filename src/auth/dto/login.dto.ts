import { IsEmail, IsNotEmpty } from 'class-validator';

export class LoginDto {
  @IsEmail()
  email: string;
  @IsNotEmpty({ message: "Please enter your password" })
  password: string;
}