import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ValidatePasswordResetTokenDocs } from '../docs';
import { ValidatePasswordResetTokenRequestDto } from '../dtos';
import { ValidatePasswordResetTokenService } from '../services/validate-password-reset-token.service';

@ApiTags('Auth')
@Controller('auth/password-reset')
export class ValidatePasswordResetTokenController {
  constructor(
    private readonly validatePasswordResetTokenService: ValidatePasswordResetTokenService,
  ) {}

  @Post('verify')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ValidatePasswordResetTokenDocs()
  async handle(
    @Body() validateDto: ValidatePasswordResetTokenRequestDto,
  ): Promise<void> {
    return this.validatePasswordResetTokenService.execute(validateDto);
  }
}
