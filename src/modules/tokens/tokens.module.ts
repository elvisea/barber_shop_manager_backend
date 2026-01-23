import { Module } from '@nestjs/common';

import { TokenRepository } from './repositories/token.repository';
import { TokenService } from './services/token.service';

import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [TokenRepository, TokenService],
  exports: [TokenService],
})
export class TokensModule {}
