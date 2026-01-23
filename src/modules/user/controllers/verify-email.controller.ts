import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { VerifyEmailDocs } from '../docs/verify-email.docs';
import { VerifyEmailRequestDto, VerifyEmailResponseDto } from '../dtos';
import { VerifyEmailService } from '../services/verify-email.service';

@ApiTags('Users')
@Controller('users/email-verification')
export class VerifyEmailController {
  constructor(private readonly verifyEmailService: VerifyEmailService) {}

  @Post('verify')
  @HttpCode(HttpStatus.OK)
  @VerifyEmailDocs()
  async handle(
    @Body() verifyEmailDto: VerifyEmailRequestDto,
  ): Promise<VerifyEmailResponseDto> {
    return this.verifyEmailService.execute(verifyEmailDto);
  }
}
