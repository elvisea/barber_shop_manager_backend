import { Module } from '@nestjs/common';

import { MemberAuthController } from './controllers/member-auth.controller';
import { MemberRefreshTokenRepository } from './repositories/member-refresh-token.repository';
import { MemberAuthService } from './services/member-auth.service';

import { CommonAuthModule } from '@/common/auth/auth.module';
import { ErrorMessageModule } from '@/error-message/error-message.module';
import { MembersModule } from '@/modules/members/members.module';
import { TokenModule } from '@/shared/token/token.module';

@Module({
  imports: [
    TokenModule, // Para usar o TokenService compartilhado
    MembersModule, // Para usar o MemberRepository e MemberResendVerificationService
    ErrorMessageModule,
    CommonAuthModule,
  ],
  controllers: [MemberAuthController],
  providers: [MemberAuthService, MemberRefreshTokenRepository],
  exports: [MemberRefreshTokenRepository],
})
export class MemberAuthModule {}
