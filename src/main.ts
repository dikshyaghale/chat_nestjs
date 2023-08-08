import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as dotenv from 'dotenv';
import { urlencoded, json } from 'express';
import { ValidationPipe } from '@nestjs/common';
import { TransformInterceptor } from './transformer/transform-interceptor';
import { WsAdapter } from '@nestjs/platform-ws';

async function bootstrap() {
  dotenv.config();

  const app = await NestFactory.create(AppModule);

  app.useGlobalInterceptors(new TransformInterceptor());
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useWebSocketAdapter(new WsAdapter(app));
  const config = new DocumentBuilder()
    .setTitle('Mis Api Documentation')
    .setVersion('V1')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api/v1/docs', app, document);
  app.use(json({ limit: '50mb' }));
  app.use(urlencoded({ extended: true, limit: '50mb' }));
  await app.listen(+process.env.APP_PORT);
}

bootstrap()
  .then(() => {
    console.log(
      `Server is running at http://localhost:${+process.env.APP_PORT}/`,
    );
    console.log(
      `For API documentation http://localhost:${+process.env
        .APP_PORT}/api/v1/docs`,
    );
  })
  .catch((error) => {
    console.log('Error: ', error || error.message);
  });
