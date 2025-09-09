import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { VerifyEmailDocs } from '../docs';
import {
  UserEmailVerificationVerifyRequestDTO,
  UserEmailVerificationVerifyResponseDTO,
} from '../dtos';
import { UserEmailVerificationVerifyService } from '../services/user-email-verification-verify.service';

@ApiTags('Verificação de Email')
@Controller('user-email-verification')
export class UserEmailVerificationVerifyController {
  constructor(
    private readonly userEmailVerificationVerifyService: UserEmailVerificationVerifyService,
  ) {}

  @Get('verify')
  @VerifyEmailDocs()
  async handle(
    @Query() query: UserEmailVerificationVerifyRequestDTO,
  ): Promise<UserEmailVerificationVerifyResponseDTO> {
    return this.userEmailVerificationVerifyService.execute(
      query.email,
      query.code,
    );
  }
}
