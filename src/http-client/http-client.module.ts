/**
 * HttpClientModule
 *
 * Módulo global responsável por prover o HttpClientService para toda a aplicação.
 * Importa o HttpModule do NestJS para permitir injeção do HttpService.
 */
import { HttpModule } from '@nestjs/axios';
import { Global, Module } from '@nestjs/common';

import { HttpClientService } from './http-client.service';

@Global()
@Module({
  imports: [HttpModule],
  providers: [HttpClientService],
  exports: [HttpClientService],
})
export class HttpClientModule {}
