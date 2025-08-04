import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  UserEmailVerificationVerifyRequestDTO,
  UserEmailVerificationVerifyResponseDTO,
} from '../dtos';
import { UserEmailVerificationVerifyService } from '../services/user-email-verification-verify.service';

@ApiTags('Verificação de Email')
@Controller('user-email-verification')
export class UserEmailVerificationVerifyController {
  constructor(
    private readonly userEmailVerificationVerifyService: UserEmailVerificationVerifyService,
  ) {}

  @Get('verify')
  @ApiOperation({ summary: 'Verificar email do usuário com código' })
  @ApiResponse({
    status: 200,
    description: 'Email verificado com sucesso',
    type: UserEmailVerificationVerifyResponseDTO,
  })
  @ApiResponse({
    status: 404,
    description: 'Token não encontrado',
  })
  @ApiResponse({
    status: 409,
    description: 'Email já verificado',
  })
  @ApiResponse({
    status: 400,
    description: 'Código de verificação expirado',
  })
  @ApiResponse({
    status: 400,
    description: 'Código de verificação inválido',
  })
  async handle(
    @Query() query: UserEmailVerificationVerifyRequestDTO,
  ): Promise<UserEmailVerificationVerifyResponseDTO> {
    return this.userEmailVerificationVerifyService.execute(
      query.email,
      query.code,
    );
  }
}
