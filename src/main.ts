import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { StorageConfig } from 'config/storage.config';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.useStaticAssets(StorageConfig.thumbnailDestination, {
    prefix: StorageConfig.urlPrefix,
    maxAge: StorageConfig.maxAge, //7 dana
    index: false,
  })

  app.enableCors({
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS', 
    allowedHeaders: 'Content-Type, Accept, Authorization', 
    credentials: true, 
  });

  await app.listen(process.env.PORT ?? 3000);
}

bootstrap();