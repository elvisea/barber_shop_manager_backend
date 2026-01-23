import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { EncryptionService } from './encryption.service';

/**
 * Module responsável por fornecer serviços de criptografia.
 *
 * Exporta EncryptionService para uso em outros módulos.
 */
@Module({
  imports: [ConfigModule],
  providers: [EncryptionService],
  exports: [EncryptionService],
})
export class EncryptionModule {}
