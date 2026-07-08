import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, ClassSerializerInterceptor, VersioningType } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Config api version
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: '1',
  });
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  // Config validation
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, transform: true }));

  // Config cors
  app.enableCors();
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
