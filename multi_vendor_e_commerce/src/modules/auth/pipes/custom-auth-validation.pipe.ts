import {
  BadRequestException,
  Injectable,
  ValidationPipe,
} from '@nestjs/common';

interface ICustomAuthValidationOptions {
  message?: string;
}

@Injectable()
export class CustomAuthValidationPipe extends ValidationPipe {
  constructor(private readonly options: ICustomAuthValidationOptions = {}) {
    super({
      whitelist: true,

      transform: true,

      forbidNonWhitelisted: true,

      exceptionFactory: (errors) => {
        const validationMessages = errors.flatMap((error) =>
          Object.values(error.constraints || {}),
        );
        if (process.env.ENVIRONMENT === 'DEV') {
          return new BadRequestException({
            success: false,
            message: validationMessages,
            statusCode: 400,
            error: 'Bad Request',
          });
        }

        return new BadRequestException({
          success: false,
          message: options.message || 'Fields are missing or invalid',
          statusCode: 400,
          error: 'Bad Request',
        });
      },
    });
  }
}
