import { Module } from '@nestjs/common';

import { CreateUserController } from './controllers/create-user.controller';
import { UserRepository } from './repositories/user.repository';
import { CreateUserService } from './services/create-user.service';

@Module({
  controllers: [CreateUserController],
  providers: [
    UserRepository,
    CreateUserService,
  ],
  exports: [
    UserRepository,
    CreateUserService,
  ],
})
export class UserModule { } 