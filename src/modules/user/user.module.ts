import { Module } from '@nestjs/common';

import { CreateUserMemberController } from './controllers/create-user-member.controller';
import { CreateUserController } from './controllers/create-user.controller';
import { UserRepository } from './repositories/user.repository';
import { CreateUserMemberService } from './services/create-user-member.service';
import { CreateUserService } from './services/create-user.service';

import { UserEmailVerificationModule } from '@/modules/user-email-verification/user-email-verification.module';

@Module({
  imports: [UserEmailVerificationModule],
  controllers: [CreateUserController, CreateUserMemberController],
  providers: [CreateUserService, CreateUserMemberService, UserRepository],
  exports: [UserRepository, CreateUserService],
})
export class UserModule {}
