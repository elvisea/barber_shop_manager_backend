import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';

import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { JwtStrategy } from '../strategies/jwt.strategy';

import { TokenModule } from '@/shared/token/token.module';

@Module({
  imports: [
    PassportModule,
    TokenModule, // Usa a configuração JWT do TokenModule
  ],
  providers: [JwtStrategy, JwtAuthGuard],
  exports: [JwtAuthGuard, JwtStrategy],
})
export class CommonAuthModule {}
