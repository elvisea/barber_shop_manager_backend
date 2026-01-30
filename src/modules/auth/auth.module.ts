import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { EmailsModule } from '../emails/emails.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { TokensModule } from '../tokens/tokens.module';
import { UserModule } from '../user/user.module';

import { AuthController } from './controllers/auth.controller';
import { RequestPasswordResetController } from './controllers/request-password-reset.controller';
import { ResetPasswordController } from './controllers/reset-password.controller';
import { ValidatePasswordResetTokenController } from './controllers/validate-password-reset-token.controller';
import { AuthService } from './services/auth.service';
import { RequestPasswordResetService } from './services/request-password-reset.service';
import { ResetPasswordService } from './services/reset-password.service';
import { ValidatePasswordResetTokenService } from './services/validate-password-reset-token.service';

import { CommonAuthModule } from '@/common/auth/auth.module';
import { TokenModule } from '@/shared/token/token.module';

@Module({
  imports: [
    UserModule,
    RefreshTokenModule,
    TokenModule,
    CommonAuthModule,
    TokensModule,
    EmailsModule,
    EventEmitterModule,
  ],
  controllers: [
    AuthController,
    RequestPasswordResetController,
    ValidatePasswordResetTokenController,
    ResetPasswordController,
  ],
  providers: [
    AuthService,
    RequestPasswordResetService,
    ValidatePasswordResetTokenService,
    ResetPasswordService,
  ],
  exports: [],
})
export class AuthModule {}
