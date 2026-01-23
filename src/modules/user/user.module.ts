import { Module } from '@nestjs/common';

import { CreateUserController } from './controllers/create-user.controller';
import { ResendVerificationController } from './controllers/resend-verification.controller';
import { VerifyEmailController } from './controllers/verify-email.controller';
import { UserRepository } from './repositories/user.repository';
import { CreateUserService } from './services/create-user.service';
import { ResendVerificationService } from './services/resend-verification.service';
import { VerifyEmailService } from './services/verify-email.service';

import { EncryptionModule } from '@/common/encryption/encryption.module';
import { TokensModule } from '@/modules/tokens/tokens.module';

@Module({
  imports: [TokensModule, EncryptionModule],
  controllers: [
    CreateUserController,
    VerifyEmailController,
    ResendVerificationController,
  ],
  providers: [
    CreateUserService,
    VerifyEmailService,
    ResendVerificationService,
    UserRepository,
  ],
  exports: [UserRepository, CreateUserService],
})
export class UserModule {}
