import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResendVerificationDocs } from '../docs/resend-verification.docs';
import {
  ResendVerificationRequestDto,
  ResendVerificationResponseDto,
} from '../dtos';
import { ResendVerificationService } from '../services/resend-verification.service';

@ApiTags('Users')
@Controller('users/email-verification')
export class ResendVerificationController {
  constructor(
    private readonly resendVerificationService: ResendVerificationService,
  ) {}

  @Post('resend')
  @HttpCode(HttpStatus.OK)
  @ResendVerificationDocs()
  async handle(
    @Body() resendDto: ResendVerificationRequestDto,
  ): Promise<ResendVerificationResponseDto> {
    return this.resendVerificationService.execute(resendDto);
  }
}
