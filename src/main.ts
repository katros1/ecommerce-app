import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(new ValidationPipe({whitelist:true}));
  app.setGlobalPrefix('api/v1')

  const config = new DocumentBuilder()
    .setTitle('ecommerce-documatation')
    .setDescription('Ththis is app documentation')
    .setVersion('1.0')
    .addServer('http://localhost:3000/', 'Local environment')
    .addServer('https://ecommerce-app-99ew.onrender.com/', 'Production')
    .addTag('swagger-doc')
    .addBearerAuth()
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-doc', app, document);
  await app.listen(3000);
}
bootstrap();
