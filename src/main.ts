import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@/app.module';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';

/**
 * Main bootstrap file for the Barber Shop Manager application.
 * Configures global filters, pipes, Swagger and starts the server.
 *
 * @module main
 */

/**
 * Bootstrap function responsible for:
 * - Creating the NestJS application
 * - Applying global exception filters
 * - Applying global validation pipes
 * - Configuring and exposing Swagger documentation
 * - Getting environment service configurations
 * - Starting the HTTP server on the configured port
 *
 * @async
 * @function bootstrap
 * @returns {Promise<void>} Promise that resolves when the server is running
 */
async function bootstrap(): Promise<void> {
  /* Create the main application using AppModule */
  const app = await NestFactory.create(AppModule);

  /* Get configuration service to access environment variables */
  const configService = app.get<ConfigService>(ConfigService);

  /* Configure CORS based on environment */
  const isDevelopment =
    configService.get('NODE_ENV', 'development') === 'development';

  const origin = isDevelopment ? '*' : '*'; // TODO: change to the production domain

  app.enableCors({
    origin,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
    ],
  });

  /* Increase body parser limits */
  /* verify if this is necessary */
  app.use(require('body-parser').json({ limit: '10mb' }));
  app.use(require('body-parser').urlencoded({ limit: '10mb', extended: true }));

  /* Apply global custom exception filter */
  app.useGlobalFilters(new AllExceptionsFilter());

  /*
   * Apply global validation pipe:
   * - transform: converts payloads to expected types
   * - whitelist: removes properties not declared in DTOs
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  /*
   * Configure Swagger documentation:
   * - Title, description, version and Bearer authentication
   * - Available at /api/docs
   */
  const config = new DocumentBuilder()
    .setTitle('Barber Shop Manager')
    .setDescription('Barber Shop Manager system API for barbershop management')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/api/docs', app, document);

  /* Get server port from environment variables or use 3333 as default */
  const port = configService.get<number>('PORT', 3333);

  /* Start HTTP server on defined port */
  await app.listen(port);
}

// Initialize the application
bootstrap();
