import { IsNotEmpty } from 'class-validator';

export class RefreshDto {
  @IsNotEmpty({ message: "No refresh Token provided, Please log-in" })
  password: string;
}