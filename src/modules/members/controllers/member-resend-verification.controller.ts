import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResendMemberVerificationDocs } from '../docs';
import {
  MemberResendVerificationRequestDto,
  MemberResendVerificationResponseDto,
} from '../dtos';
import { MemberResendVerificationService } from '../services/member-resend-verification.service';

@ApiTags('Members')
@Controller('members/email-verification')
export class MemberResendVerificationController {
  constructor(
    private readonly memberResendVerificationService: MemberResendVerificationService,
  ) {}

  @Post('resend')
  @HttpCode(HttpStatus.OK)
  @ResendMemberVerificationDocs()
  async handle(
    @Body() resendDto: MemberResendVerificationRequestDto,
  ): Promise<MemberResendVerificationResponseDto> {
    return this.memberResendVerificationService.execute({
      email: resendDto.email,
    });
  }
}
