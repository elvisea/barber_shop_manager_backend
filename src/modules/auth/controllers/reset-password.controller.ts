import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResetPasswordDocs } from '../docs';
import { ResetPasswordRequestDto } from '../dtos';
import { ResetPasswordService } from '../services/reset-password.service';

@ApiTags('Auth')
@Controller('auth/password-reset')
export class ResetPasswordController {
  constructor(private readonly resetPasswordService: ResetPasswordService) {}

  @Post('confirm')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ResetPasswordDocs()
  async handle(@Body() resetDto: ResetPasswordRequestDto): Promise<void> {
    return this.resetPasswordService.execute(resetDto);
  }
}
