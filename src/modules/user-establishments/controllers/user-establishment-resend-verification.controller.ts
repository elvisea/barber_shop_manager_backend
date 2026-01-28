import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  MemberResendVerificationRequestDto,
  MemberResendVerificationResponseDto,
} from '../../members/dtos';
import { ResendUserEstablishmentVerificationDocs } from '../docs';

import { ResendVerificationRequestDto } from '@/modules/user/dtos/resend-verification-request.dto';
import { ResendVerificationService } from '@/modules/user/services/resend-verification.service';

@ApiTags('Members')
@Controller('members/email-verification')
export class UserEstablishmentResendVerificationController {
  constructor(
    private readonly resendVerificationService: ResendVerificationService,
  ) {}

  @Post('resend')
  @HttpCode(HttpStatus.OK)
  @ResendUserEstablishmentVerificationDocs()
  async handle(
    @Body() resendDto: MemberResendVerificationRequestDto,
  ): Promise<MemberResendVerificationResponseDto> {
    const dto: ResendVerificationRequestDto = {
      email: resendDto.email,
    };
    return this.resendVerificationService.execute(dto);
  }
}
