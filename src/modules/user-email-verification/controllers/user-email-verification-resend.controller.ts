import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { ResendVerificationDocs } from '../docs';
import { UserEmailVerificationResendRequestDTO } from '../dtos/user-email-verification-resend-request.dto';
import { UserEmailVerificationResendResponseDTO } from '../dtos/user-email-verification-resend-response.dto';
import { UserEmailVerificationResendService } from '../services/user-email-verification-resend.service';

@ApiTags('Verificação de Email')
@Controller('user-email-verification')
export class UserEmailVerificationResendController {
  constructor(
    private readonly userEmailVerificationResendService: UserEmailVerificationResendService,
  ) {}

  @Post('resend')
  @ResendVerificationDocs()
  async handle(
    @Body() dto: UserEmailVerificationResendRequestDTO,
  ): Promise<UserEmailVerificationResendResponseDTO> {
    return await this.userEmailVerificationResendService.execute(dto.email);
  }
}
