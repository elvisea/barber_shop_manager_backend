import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { UserEmailVerificationResendRequestDTO } from '../dtos/user-email-verification-resend-request.dto';
import { UserEmailVerificationResendResponseDTO } from '../dtos/user-email-verification-resend-response.dto';
import { UserEmailVerificationResendService } from '../services/user-email-verification-resend.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

@ApiTags('Verificação de Email')
@Controller('user-email-verification')
export class UserEmailVerificationResendController {
  constructor(
    private readonly userEmailVerificationResendService: UserEmailVerificationResendService,
  ) { }

  @Post('resend')
  @ApiOperation({
    summary: 'Reenviar token de verificação de email',
    description:
      'Solicita um novo token de verificação para o email especificado. Útil quando o token anterior expirou.',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Token reenviado com sucesso',
    type: UserEmailVerificationResendResponseDTO,
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
    @Body() dto: UserEmailVerificationResendRequestDTO,
  ): Promise<UserEmailVerificationResendResponseDTO> {
    return await this.userEmailVerificationResendService.execute(dto.email);
  }
}
