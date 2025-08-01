import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { MemberAuthRequestDTO } from '../dtos/member-auth-request.dto';
import { MemberAuthResponseDTO } from '../dtos/member-auth-response.dto';
import { MemberAuthService } from '../services/member-auth.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

@ApiTags('Authentication')
@Controller('member-auth')
export class MemberAuthController {
  constructor(private readonly memberAuthService: MemberAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate member and return tokens' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Member authentication successful',
    type: MemberAuthResponseDTO,
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: SwaggerErrors[ErrorCode.INVALID_EMAIL_OR_PASSWORD].description,
    schema: {
      example: SwaggerErrors[ErrorCode.INVALID_EMAIL_OR_PASSWORD].example,
    },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
    schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].description,
    schema: { example: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].example },
  })
  async handle(
    @Body() authRequest: MemberAuthRequestDTO,
  ): Promise<MemberAuthResponseDTO> {
    return this.memberAuthService.execute(authRequest);
  }
}
