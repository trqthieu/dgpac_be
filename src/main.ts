import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Massage Booking API')
    .setDescription('API documentation for the Massage Booking System')
    .setVersion('1.0')
    .addBearerAuth() // if you're using JWT authentication
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api-docs', app, document);

  await app.listen(3000);
}
bootstrap();
