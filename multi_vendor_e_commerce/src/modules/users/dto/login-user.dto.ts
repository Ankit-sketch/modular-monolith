import { IsEmail, MinLength } from 'class-validator';
//Data Transfer Object
export class LoginUserDto {
  @IsEmail()
  email!: string;

  @MinLength(6)
  password!: string;
}
