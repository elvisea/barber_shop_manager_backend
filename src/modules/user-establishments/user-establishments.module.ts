import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';

import { UserEstablishmentCreateController } from './controllers/user-establishment-create.controller';
import { UserEstablishmentDeleteController } from './controllers/user-establishment-delete.controller';
import { UserEstablishmentFindAllController } from './controllers/user-establishment-find-all.controller';
import { UserEstablishmentFindByIdController } from './controllers/user-establishment-find-by-id.controller';
import { UserEstablishmentResendVerificationController } from './controllers/user-establishment-resend-verification.controller';
import { UserEstablishmentSummaryController } from './controllers/user-establishment-summary.controller';
import { UserEstablishmentUpdateController } from './controllers/user-establishment-update.controller';
import { UserEstablishmentVerifyEmailController } from './controllers/user-establishment-verify-email.controller';
import { UserEstablishmentRepository } from './repositories/user-establishment.repository';
import { UserEstablishmentCreateService } from './services/user-establishment-create.service';
import { UserEstablishmentDeleteService } from './services/user-establishment-delete.service';
import { UserEstablishmentFindAllByEstablishmentService } from './services/user-establishment-find-all-by-establishment.service';
import { UserEstablishmentFindAllService } from './services/user-establishment-find-all.service';
import { UserEstablishmentFindByIdService } from './services/user-establishment-find-by-id.service';
import { UserEstablishmentSummaryService } from './services/user-establishment-summary.service';
import { UserEstablishmentUpdateService } from './services/user-establishment-update.service';
import { UserEstablishmentValidationService } from './services/user-establishment-validation.service';

import { EstablishmentModule } from '@/modules/establishment/establishment.module';
import { TokensModule } from '@/modules/tokens/tokens.module';
import { UserModule } from '@/modules/user/user.module';

@Module({
  imports: [EventEmitterModule, EstablishmentModule, TokensModule, UserModule],
  controllers: [
    UserEstablishmentFindAllController,
    UserEstablishmentCreateController,
    UserEstablishmentFindByIdController,
    UserEstablishmentUpdateController,
    UserEstablishmentDeleteController,
    UserEstablishmentVerifyEmailController,
    UserEstablishmentResendVerificationController,
    UserEstablishmentSummaryController,
  ],
  providers: [
    UserEstablishmentFindAllService,
    UserEstablishmentFindAllByEstablishmentService,
    UserEstablishmentCreateService,
    UserEstablishmentFindByIdService,
    UserEstablishmentUpdateService,
    UserEstablishmentDeleteService,
    UserEstablishmentSummaryService,
    UserEstablishmentValidationService,
    UserEstablishmentRepository,
  ],
  exports: [UserEstablishmentRepository, UserEstablishmentValidationService],
})
export class UserEstablishmentsModule {}
