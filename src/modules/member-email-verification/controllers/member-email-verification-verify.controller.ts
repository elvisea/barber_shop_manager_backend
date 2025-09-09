import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { VerifyMemberEmailDocs } from '../docs';
import {
  MemberEmailVerificationVerifyRequestDTO,
  MemberEmailVerificationVerifyResponseDTO,
} from '../dtos';
import { MemberEmailVerificationVerifyService } from '../services/member-email-verification-verify.service';

@ApiTags('Verificação de Email - Membro')
@Controller('member-email-verification')
export class MemberEmailVerificationVerifyController {
  constructor(
    private readonly memberEmailVerificationVerifyService: MemberEmailVerificationVerifyService,
  ) {}

  @Get('verify')
  @VerifyMemberEmailDocs()
  async handle(
    @Query() query: MemberEmailVerificationVerifyRequestDTO,
  ): Promise<MemberEmailVerificationVerifyResponseDTO> {
    return this.memberEmailVerificationVerifyService.execute(
      query.email,
      query.code,
    );
  }
}
