import { Module } from '@nestjs/common';

import { CreateUserController } from './controllers/create-user.controller';
import { UserRepository } from './repositories/user.repository';
import { CreateUserService } from './services/create-user.service';

import { UserEmailVerificationModule } from '@/modules/user-email-verification/user-email-verification.module';

@Module({
  imports: [UserEmailVerificationModule],
  controllers: [CreateUserController],
  providers: [CreateUserService, UserRepository],
  exports: [UserRepository, CreateUserService],
})
export class UserModule {}
