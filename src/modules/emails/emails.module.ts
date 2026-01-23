import { Module } from '@nestjs/common';

import { MemberCreatedListener } from './listeners/member-created.listener';
import { MemberVerificationTokenSentListener } from './listeners/member-verification-token-sent.listener';
import { UserCreatedListener } from './listeners/user-created.listener';
import { UserVerificationTokenSentListener } from './listeners/user-verification-token-sent.listener';

import { EmailServiceModule } from '@/common/email-service/email-service.module';

@Module({
  imports: [EmailServiceModule],
  providers: [
    UserCreatedListener,
    MemberCreatedListener,
    UserVerificationTokenSentListener,
    MemberVerificationTokenSentListener,
  ],
})
export class EmailsModule {}
