import { Module } from '@nestjs/common';
import { UsersModule } from '@modules/users/users.module';
// import { jwtConfig } from '@config/environmet.config';
import { ConfigModule, ConfigService } from '@nestjs/config';

import { AuthController } from './auth.controller';
import { JwtModule, JwtModuleOptions } from '@nestjs/jwt';
import { AuthService } from './auth.service';
@Module({
  imports: [
    UsersModule,
    // Register the JwtModule asynchronously
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): JwtModuleOptions => {
        console.log(configService, 'configService1');
        return {
          secret: configService.get<string>('jwt.secret'),
          signOptions: {
            expiresIn: '7d',
          },
        };
      },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [JwtModule, AuthService],
})
export class AuthModule {}
