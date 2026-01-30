import { Module } from '@nestjs/common';

import { TokenRepository } from './repositories/token.repository';
import { EmailVerificationTokenService } from './services/email-verification-token.service';
import { PasswordResetTokenService } from './services/password-reset-token.service';
import { TokenValidationService } from './services/token-validation.service';

@Module({
  imports: [],
  providers: [
    TokenRepository,
    EmailVerificationTokenService,
    PasswordResetTokenService,
    TokenValidationService,
  ],
  exports: [
    TokenRepository,
    EmailVerificationTokenService,
    PasswordResetTokenService,
    TokenValidationService,
  ],
})
export class TokensModule {}
