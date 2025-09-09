import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResendMemberVerificationDocs } from '../docs';
import { MemberEmailVerificationResendRequestDTO } from '../dtos/member-email-verification-resend-request.dto';
import { MemberEmailVerificationResendResponseDTO } from '../dtos/member-email-verification-resend-response.dto';
import { MemberEmailVerificationResendService } from '../services/member-email-verification-resend.service';

@ApiTags('Verificação de Email - Membro')
@Controller('member-email-verification')
export class MemberEmailVerificationResendController {
  constructor(
    private readonly memberEmailVerificationResendService: MemberEmailVerificationResendService,
  ) {}

  @Post('resend')
  @ResendMemberVerificationDocs()
  async handle(
    @Body() dto: MemberEmailVerificationResendRequestDTO,
  ): Promise<MemberEmailVerificationResendResponseDTO> {
    return await this.memberEmailVerificationResendService.execute(dto.email);
  }
}
