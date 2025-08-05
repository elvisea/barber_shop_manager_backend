import { Module } from '@nestjs/common';

import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { UserModule } from '../user/user.module';
import { UserEmailVerificationModule } from '../user-email-verification/user-email-verification.module';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

import { CommonAuthModule } from '@/common/auth/auth.module';
import { ErrorMessageModule } from '@/error-message/error-message.module';
import { TokenModule } from '@/shared/token/token.module';

@Module({
  imports: [
    UserModule,
    RefreshTokenModule,
    UserEmailVerificationModule,

    ErrorMessageModule,
    TokenModule,
    CommonAuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule {}
