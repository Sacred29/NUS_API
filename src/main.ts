import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, );

  // Swagger bootstrap
  const config = new DocumentBuilder()
    .setTitle('Gift of Caring')
    .setDescription('API for Gift of Caring Project')
    .setVersion('1.0')
    .addBearerAuth()
    // .addTag('cats')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/v1', app, document);


  await app.listen(3000);
}
bootstrap();
