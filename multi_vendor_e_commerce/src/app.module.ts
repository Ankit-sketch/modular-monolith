import { Module } from '@nestjs/common';
// import { AppController } from './app.controller';
// import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from '@infra/prisma/prisma.module';
import { UsersModule } from '@modules/users/users.module';
import { AuthModule } from '@modules/auth/auth.module';
import { ThrottlerModule, ThrottlerModuleOptions } from '@nestjs/throttler';
import environment from '@config/environmet.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true, // Makes the ConfigService available across entire app

      // load expects ConfigFactory functions returning config objects
      load: [environment],
    }),
    ThrottlerModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService): ThrottlerModuleOptions => {
        console.log(configService, 'configService in ThrottlerModule');
        return [
          {
            name: 'short',
            ttl: configService.get<number>('throttlerConfig.short.ttl') || 1000,
            limit:
              configService.get<number>('throttlerConfig.short.limit') || 10,
          },
          {
            name: 'medium',
            ttl:
              configService.get<number>('throttlerConfig.medium.ttl') || 10000,
            limit:
              configService.get<number>('throttlerConfig.medium.limit') || 30,
          },
          {
            name: 'long',
            ttl: configService.get<number>('throttlerConfig.long.ttl') || 900,
            limit:
              configService.get<number>('throttlerConfig.long.limit') || 100,
          },
        ];
      },
    }),
    PrismaModule,
    UsersModule,
    AuthModule,
  ],
  // controllers: [AppController],
})
export class AppModule {}
