import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateAuthRequestDTO } from '../dtos/create-auth-request.dto';
import { CreateAuthResponseDTO } from '../dtos/create-auth-response.dto';
import { AuthService } from '../services/auth.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

@ApiTags('Authentication')
@Controller('user-auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Authenticate user and return tokens' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Authentication successful',
    type: CreateAuthResponseDTO,
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
  async handle(
    @Body() authRequest: CreateAuthRequestDTO,
  ): Promise<CreateAuthResponseDTO> {
    return this.authService.execute(authRequest);
  }
}
