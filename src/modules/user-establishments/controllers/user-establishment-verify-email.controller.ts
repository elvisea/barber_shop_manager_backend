import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import {
  MemberVerifyEmailRequestDto,
  MemberVerifyEmailResponseDto,
} from '../../members/dtos';
import { VerifyUserEstablishmentEmailDocs } from '../docs';

import { VerifyEmailRequestDto } from '@/modules/user/dtos/verify-email-request.dto';
import { VerifyEmailService } from '@/modules/user/services/verify-email.service';

@ApiTags('Members')
@Controller('members/email-verification')
export class UserEstablishmentVerifyEmailController {
  constructor(private readonly verifyEmailService: VerifyEmailService) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @VerifyUserEstablishmentEmailDocs()
  async handle(
    @Body() verifyEmailDto: MemberVerifyEmailRequestDto,
  ): Promise<MemberVerifyEmailResponseDto> {
    const dto: VerifyEmailRequestDto = {
      email: verifyEmailDto.email,
      token: verifyEmailDto.token,
    };
    return this.verifyEmailService.execute(dto);
  }
}
