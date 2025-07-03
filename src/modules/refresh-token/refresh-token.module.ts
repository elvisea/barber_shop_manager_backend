import { Module } from '@nestjs/common';

import { PrismaModule } from '@/prisma/prisma.module';

import { RefreshTokenRepository } from './repositories/refresh-token.repository';

@Module({
  imports: [PrismaModule],
  providers: [RefreshTokenRepository],
  exports: [RefreshTokenRepository],
})
export class RefreshTokenModule { } 