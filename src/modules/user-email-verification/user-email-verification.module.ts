import { Module } from '@nestjs/common';

import { UserEmailVerificationVerifyController } from './controllers/user-email-verification-verify.controller';
import { UserEmailVerificationRepository } from './repositories/user-email-verification.repository';
import { UserEmailVerificationCreateService } from './services/user-email-verification-create.service';
import { UserEmailVerificationVerifyService } from './services/user-email-verification-verify.service';

@Module({
  controllers: [UserEmailVerificationVerifyController],
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
