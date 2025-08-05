import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MemberEmailVerificationResendRequestDTO } from '../dtos/member-email-verification-resend-request.dto';
import { MemberEmailVerificationResendResponseDTO } from '../dtos/member-email-verification-resend-response.dto';
import { MemberEmailVerificationResendService } from '../services/member-email-verification-resend.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

@ApiTags('Verificação de Email - Membro')
@ApiBearerAuth()
@Controller('member-email-verification')
export class MemberEmailVerificationResendController {
  constructor(
    private readonly memberEmailVerificationResendService: MemberEmailVerificationResendService,
  ) {}

  @Post('resend')
  @ApiOperation({
    summary: 'Reenviar token de verificação de email para membro',
    description:
      'Solicita um novo token de verificação para o email do membro especificado. Útil quando o token anterior expirou.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token reenviado com sucesso',
    type: MemberEmailVerificationResendResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description:
      SwaggerErrors[ErrorCode.USER_EMAIL_VERIFICATION_NOT_FOUND].description,
    schema: {
      example:
        SwaggerErrors[ErrorCode.USER_EMAIL_VERIFICATION_NOT_FOUND].example,
    },
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: SwaggerErrors[ErrorCode.EMAIL_ALREADY_VERIFIED].description,
    schema: {
      example: SwaggerErrors[ErrorCode.EMAIL_ALREADY_VERIFIED].example,
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
    schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
  })
  async handle(
    @Body() dto: MemberEmailVerificationResendRequestDTO,
  ): Promise<MemberEmailVerificationResendResponseDTO> {
    return await this.memberEmailVerificationResendService.execute(dto.email);
  }
}
