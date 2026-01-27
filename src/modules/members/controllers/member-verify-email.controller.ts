import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { VerifyMemberEmailDocs } from '../docs';
import {
  MemberVerifyEmailRequestDto,
  MemberVerifyEmailResponseDto,
} from '../dtos';
import { MemberVerifyEmailService } from '../services/member-verify-email.service';

@ApiTags('Members')
@Controller('members/email-verification')
export class MemberVerifyEmailController {
  constructor(
    private readonly memberVerifyEmailService: MemberVerifyEmailService,
  ) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @VerifyMemberEmailDocs()
  async handle(
    @Body() verifyEmailDto: MemberVerifyEmailRequestDto,
  ): Promise<MemberVerifyEmailResponseDto> {
    return this.memberVerifyEmailService.execute({
      email: verifyEmailDto.email,
      token: verifyEmailDto.token,
    });
  }
}
