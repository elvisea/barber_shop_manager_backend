import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RequestPasswordResetDocs } from '../docs';
import { RequestPasswordResetRequestDto } from '../dtos';
import { RequestPasswordResetService } from '../services/request-password-reset.service';

@ApiTags('Auth')
@Controller('auth/password-reset')
export class RequestPasswordResetController {
  constructor(
    private readonly requestPasswordResetService: RequestPasswordResetService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.NO_CONTENT)
  @RequestPasswordResetDocs()
  async handle(
    @Body() requestDto: RequestPasswordResetRequestDto,
  ): Promise<void> {
    return this.requestPasswordResetService.execute(requestDto);
  }
}
