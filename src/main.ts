import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { AppModule } from '@/app.module';
import { AllExceptionsFilter } from '@/common/filters/all-exceptions.filter';

/**
 * Arquivo principal de inicialização da aplicação Barber Shop Manager.
 * Configura filtros globais, pipes, Swagger e inicia o servidor.
 *
 * @module main
 */

/**
 * Função de bootstrap responsável por:
 * - Criar a aplicação NestJS
 * - Aplicar filtros globais de exceção
 * - Aplicar pipes globais de validação
 * - Configurar e expor a documentação Swagger
 * - Obter configurações do serviço de ambiente
 * - Iniciar o servidor HTTP na porta configurada
 *
 * @async
 * @function bootstrap
 * @returns {Promise<void>} Promise que resolve quando o servidor está rodando
 */
async function bootstrap(): Promise<void> {
  /* Cria a aplicação principal usando o módulo AppModule */
  const app = await NestFactory.create(AppModule);

  /* Aplica o filtro global de exceções personalizadas */
  app.useGlobalFilters(new AllExceptionsFilter());

  /*
   * Aplica o pipe global de validação:
   * - transform: converte payloads para os tipos esperados
   * - whitelist: remove propriedades não declaradas nos DTOs
   */
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
    }),
  );

  /*
   * Configura a documentação Swagger:
   * - Título, descrição, versão e autenticação Bearer
   * - Disponível em /apis/docs
   */
  const config = new DocumentBuilder()
    .setTitle('Barber Shop Manager')
    .setDescription('API do sistema Barber Shop Manager para gestão de barbearias')
    .setVersion('1.0')
    .addBearerAuth()
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('/apis/docs', app, document);

  /* Obtém o serviço de configuração para acessar variáveis de ambiente */
  const configService = app.get<ConfigService>(ConfigService);

  /* Obtém a porta do servidor a partir das variáveis de ambiente ou usa 3333 como padrão */
  const port = configService.get<number>('PORT') ?? 3333;

  /* Inicia o servidor HTTP na porta definida */
  await app.listen(port);
}

// Inicializa a aplicação
bootstrap();
