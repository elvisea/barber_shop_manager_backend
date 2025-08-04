import { Module } from '@nestjs/common';

import { UserEmailVerificationRepository } from './repositories/user-email-verification.repository';
import { UserEmailVerificationCreateService } from './services/user-email-verification-create.service';
import { UserEmailVerificationVerifyService } from './services/user-email-verification-verify.service';

@Module({
  providers: [
    UserEmailVerificationCreateService,
    UserEmailVerificationVerifyService,
    UserEmailVerificationRepository,
  ],
  exports: [
    UserEmailVerificationCreateService,
    UserEmailVerificationVerifyService,
    UserEmailVerificationRepository,
  ],
})
export class UserEmailVerificationModule {}
