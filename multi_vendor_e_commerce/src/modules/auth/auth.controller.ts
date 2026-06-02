import { Body, Controller, Post, UseGuards, UsePipes } from '@nestjs/common';

import { AuthService } from './auth.service';
import { ThrottlerGuard, SkipThrottle } from '@nestjs/throttler';

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
  @UseGuards(ThrottlerGuard)
  @Post('register')
  register(@Body() dto: RegisterUserDto) {
    return this.authService.register(dto);
  }

  @UsePipes(
    new CustomAuthValidationPipe({
      message: 'Invalid login payload',
    }),
  )
  @SkipThrottle()
  @Post('login')
  login(@Body() dto: LoginUserDto) {
    return this.authService.login(dto);
  }
}
