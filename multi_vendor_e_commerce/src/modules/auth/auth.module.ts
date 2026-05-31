import { Module } from '@nestjs/common';
import { UsersModule } from '@modules/users/users.module';
import { jwtConfig } from '@config/jwt.config';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
@Module({
  imports: [
    UsersModule,

    JwtModule.register({
      global: true,
      secret: jwtConfig.secret,
      signOptions: {
        expiresIn: '1d',
      },
    }),
  ],

  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
