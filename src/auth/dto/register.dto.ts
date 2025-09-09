import { MinLength, IsEmail, Matches } from 'class-validator';
export class RegisterDto {
    @MinLength(3, {message: "Name must be at least 3 characters"})
    name: string;
    @IsEmail()
    email: string;
    @MinLength(8, { message: "Password must be at least 8 characters"})
    @Matches(/(?=.*[A-Za-z])/, { message: "Password must contain at least one letter" })
    @Matches(/(?=.*\d)/, { message: "Password must contain at least one number" })
    @Matches(/(?=.*[@$!%*?&])/, { message: "Password must contain at least one special character" })
    password: string;
}