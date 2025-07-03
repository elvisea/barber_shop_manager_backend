import { Module } from '@nestjs/common';

import { RefreshTokenRepository } from './repositories/refresh-token.repository';

import { PrismaModule } from '@/prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RefreshTokenRepository],
  exports: [RefreshTokenRepository],
})
export class RefreshTokenModule {}
