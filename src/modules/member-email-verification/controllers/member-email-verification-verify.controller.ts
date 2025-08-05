import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import {
  MemberEmailVerificationVerifyRequestDTO,
  MemberEmailVerificationVerifyResponseDTO,
} from '../dtos';
import { MemberEmailVerificationVerifyService } from '../services/member-email-verification-verify.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

@ApiTags('Verificação de Email - Membro')
@Controller('member-email-verification')
export class MemberEmailVerificationVerifyController {
  constructor(
    private readonly memberEmailVerificationVerifyService: MemberEmailVerificationVerifyService,
  ) {}

  @Get('verify')
  @ApiOperation({ summary: 'Verificar email do membro com código' })
  @ApiResponse({
    status: 200,
    description: 'Email verificado com sucesso',
    type: MemberEmailVerificationVerifyResponseDTO,
  })
  @ApiResponse({
    status: 400,
    description:
      SwaggerErrors[ErrorCode.INVALID_VERIFICATION_TOKEN].description,
    schema: {
      example: SwaggerErrors[ErrorCode.INVALID_VERIFICATION_TOKEN].example,
    },
  })
  @ApiResponse({
    status: 400,
    description:
      SwaggerErrors[ErrorCode.VERIFICATION_TOKEN_EXPIRED].description,
    schema: {
      example: SwaggerErrors[ErrorCode.VERIFICATION_TOKEN_EXPIRED].example,
    },
  })
  @ApiResponse({
    status: 409,
    description: SwaggerErrors[ErrorCode.EMAIL_ALREADY_VERIFIED].description,
    schema: {
      example: SwaggerErrors[ErrorCode.EMAIL_ALREADY_VERIFIED].example,
    },
  })
  async handle(
    @Query() query: MemberEmailVerificationVerifyRequestDTO,
  ): Promise<MemberEmailVerificationVerifyResponseDTO> {
    return this.memberEmailVerificationVerifyService.execute(
      query.email,
      query.code,
    );
  }
}
