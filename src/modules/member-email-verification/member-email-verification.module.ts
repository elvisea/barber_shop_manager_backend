import { Module } from '@nestjs/common';

import { MemberEmailVerificationResendController } from './controllers/member-email-verification-resend.controller';
import { MemberEmailVerificationVerifyController } from './controllers/member-email-verification-verify.controller';
import { MemberEmailVerificationRepository } from './repositories/member-email-verification.repository';
import { MemberEmailVerificationCreateService } from './services/member-email-verification-create.service';
import { MemberEmailVerificationResendService } from './services/member-email-verification-resend.service';
import { MemberEmailVerificationVerifyService } from './services/member-email-verification-verify.service';

import { EmailModule } from '@/email/email.module';

@Module({
  imports: [EmailModule],
  controllers: [
    MemberEmailVerificationVerifyController,
    MemberEmailVerificationResendController,
  ],
  providers: [
    MemberEmailVerificationCreateService,
    MemberEmailVerificationVerifyService,
    MemberEmailVerificationResendService,
    MemberEmailVerificationRepository,
  ],
  exports: [
    MemberEmailVerificationCreateService,
    MemberEmailVerificationVerifyService,
    MemberEmailVerificationResendService,
    MemberEmailVerificationRepository,
  ],
})
export class MemberEmailVerificationModule {}
