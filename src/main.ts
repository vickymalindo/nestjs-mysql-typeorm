import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ResponseInterceptor } from './helpers/response.interceptor';
import { WinstonModule } from 'nest-winston';
import { instance } from './logger/logger.config';
import { HttpExceptionFilter } from './helpers/exception.interceptor';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: WinstonModule.createLogger({
      instance: instance,
    }),
  });
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new ResponseInterceptor(reflector));
  app.useGlobalFilters(new HttpExceptionFilter());
  const configService = app.get(ConfigService);
  const port = configService.get<string>('APP_PORT') ?? 8000;
  await app.listen(port, () => {
    console.log(`Server running on port : ${port}`);
  });
}
bootstrap();
