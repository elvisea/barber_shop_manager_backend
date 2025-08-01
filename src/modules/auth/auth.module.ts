import { Module } from '@nestjs/common';

import { EstablishmentMembersModule } from '../establishment-members/establishment-members.module';
import { RefreshTokenModule } from '../refresh-token/refresh-token.module';
import { UserModule } from '../user/user.module';

import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';

import { CommonAuthModule } from '@/common/auth/auth.module';
import { ErrorMessageModule } from '@/error-message/error-message.module';
import { TokenModule } from '@/shared/token/token.module';

@Module({
  imports: [
    UserModule,
    RefreshTokenModule,
    EstablishmentMembersModule,
    ErrorMessageModule,
    TokenModule,
    CommonAuthModule,
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [],
})
export class AuthModule { }
