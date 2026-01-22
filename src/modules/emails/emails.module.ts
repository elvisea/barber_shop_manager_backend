import { Module } from '@nestjs/common';

import { EmailModule } from '@/email/email.module';

import { UserCreatedListener } from './listeners/user-created.listener';
import { MemberCreatedListener } from './listeners/member-created.listener';
import { UserVerificationTokenSentListener } from './listeners/user-verification-token-sent.listener';
import { MemberVerificationTokenSentListener } from './listeners/member-verification-token-sent.listener';

@Module({
  imports: [EmailModule],
  providers: [
    UserCreatedListener,
    MemberCreatedListener,
    UserVerificationTokenSentListener,
    MemberVerificationTokenSentListener,
  ],
})
export class EmailsModule {}
