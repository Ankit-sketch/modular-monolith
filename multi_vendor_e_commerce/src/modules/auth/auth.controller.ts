import { Body, Controller, Post, UsePipes } from '@nestjs/common';

import { AuthService } from './auth.service';

import { RegisterUserDto } from './dto/register.dto';

import { CustomAuthValidationPipe } from './pipes/custom-auth-validation.pipe';
import { LoginUserDto } from '../users/dto/login-user.dto';

@Controller({
  path: 'auth',
  version: '1',
})
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @UsePipes(
    new CustomAuthValidationPipe({
      message: 'Invalid registration payload',
    }),
  )
  @Post('register')
  register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @UsePipes(
    new CustomAuthValidationPipe({
      message: 'Invalid login payload',
    }),
  )
  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }
}
