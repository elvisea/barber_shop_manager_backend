import { Module } from '@nestjs/common';

import { UserEmailVerificationResendController } from './controllers/user-email-verification-resend.controller';
import { UserEmailVerificationVerifyController } from './controllers/user-email-verification-verify.controller';
import { UserEmailVerificationRepository } from './repositories/user-email-verification.repository';
import { UserEmailVerificationCreateService } from './services/user-email-verification-create.service';
import { UserEmailVerificationResendService } from './services/user-email-verification-resend.service';
import { UserEmailVerificationVerifyService } from './services/user-email-verification-verify.service';

@Module({
  imports: [],
  controllers: [
    UserEmailVerificationVerifyController,
    UserEmailVerificationResendController,
  ],
  providers: [
    UserEmailVerificationCreateService,
    UserEmailVerificationVerifyService,
    UserEmailVerificationResendService,
    UserEmailVerificationRepository,
  ],
  exports: [
    UserEmailVerificationCreateService,
    UserEmailVerificationVerifyService,
    UserEmailVerificationResendService,
    UserEmailVerificationRepository,
  ],
})
export class UserEmailVerificationModule {}
