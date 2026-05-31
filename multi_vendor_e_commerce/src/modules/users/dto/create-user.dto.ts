import { IsEmail, IsString, MinLength } from 'class-validator';
//Data Transfer Object
export class CreateUserDto {
  @IsEmail()
  email!: string;

  @IsString()
  firstName!: string;

  @IsString()
  lastName!: string;

  @MinLength(6)
  password!: string;
}
