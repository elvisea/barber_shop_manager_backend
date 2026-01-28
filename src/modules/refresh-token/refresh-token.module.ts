import { Module } from '@nestjs/common';

import { RefreshController } from './controllers/refresh.controller';
import { RefreshTokenRepository } from './repositories/refresh-token.repository';
import { RefreshTokenRefreshService } from './services/refresh-token-refresh.service';

import { PrismaModule } from '@/prisma/prisma.module';
import { TokenModule } from '@/shared/token/token.module';

@Module({
  imports: [PrismaModule, TokenModule],
  controllers: [RefreshController],
  providers: [RefreshTokenRepository, RefreshTokenRefreshService],
  exports: [RefreshTokenRepository],
})
export class RefreshTokenModule {}
