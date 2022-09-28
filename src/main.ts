import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { ClassSerializerInterceptor, ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  app.enableCors({
    origin: [
      'http://localhost:3000',
      'https://quiz-freeze.vercel.app',
      'https://quiz-freeze.site',
      'https://www.quiz-freeze.site',
    ],
    credentials: true,
  });
  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalInterceptors(new ClassSerializerInterceptor(app.get(Reflector)));

  const config = new DocumentBuilder()
    .setTitle('Swagger Quiz')
    .setDescription('The Quiz API routes')
    .setVersion('1.0')
    .setExternalDoc('JSON version', `${process.env.HOST_URL}/docs-json`)
    .build();

  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('docs', app, document);

  await app.listen(process.env.PORT || 3000);
}

bootstrap();
