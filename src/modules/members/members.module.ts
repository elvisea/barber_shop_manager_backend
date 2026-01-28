import { Module } from '@nestjs/common';

import { MemberCreateController } from './controllers/member-create.controller';
import { MemberDeleteController } from './controllers/member-delete.controller';
import { MemberFindAllController } from './controllers/member-find-all.controller';
import { MemberFindByIdController } from './controllers/member-find-by-id.controller';
import { MemberResendVerificationController } from './controllers/member-resend-verification.controller';
import { MemberSummaryController } from './controllers/member-summary.controller';
import { MemberUpdateController } from './controllers/member-update.controller';
import { MemberVerifyEmailController } from './controllers/member-verify-email.controller';
import { MemberRepository } from './repositories/member.repository';
import { MemberCreateService } from './services/member-create.service';
import { MemberDeleteService } from './services/member-delete.service';
import { MemberEstablishmentValidationService } from './services/member-establishment-validation.service';
import { MemberFindAllService } from './services/member-find-all.service';
import { MemberFindByIdService } from './services/member-find-by-id.service';
import { MemberResendVerificationService } from './services/member-resend-verification.service';
import { MemberSummaryService } from './services/member-summary.service';
import { MemberUpdateService } from './services/member-update.service';
import { MemberVerifyEmailService } from './services/member-verify-email.service';

import { EstablishmentModule } from '@/modules/establishment/establishment.module';
import { TokensModule } from '@/modules/tokens/tokens.module';
import { UserEstablishmentsModule } from '@/modules/user-establishments/user-establishments.module';

@Module({
  imports: [EstablishmentModule, TokensModule, UserEstablishmentsModule],
  controllers: [
    MemberCreateController,
    MemberFindAllController,
    MemberFindByIdController,
    MemberUpdateController,
    MemberDeleteController,
    MemberVerifyEmailController,
    MemberResendVerificationController,
    MemberSummaryController,
  ],
  providers: [
    MemberCreateService,
    MemberFindAllService,
    MemberFindByIdService,
    MemberUpdateService,
    MemberDeleteService,
    MemberRepository,
    MemberVerifyEmailService,
    MemberResendVerificationService,
    MemberSummaryService,
    MemberEstablishmentValidationService,
  ],
  exports: [
    MemberRepository,
    MemberVerifyEmailService,
    MemberResendVerificationService,
    MemberEstablishmentValidationService,
  ],
})
export class MembersModule {}
