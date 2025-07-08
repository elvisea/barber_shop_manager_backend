import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateAuthRequestDTO } from '../dtos/create-auth-request.dto';
import { CreateAuthResponseDTO } from '../dtos/create-auth-response.dto';
import { AuthService } from '../services/auth.service';

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';

@ApiTags('Authentication')
@Controller('auth')
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
    description: SwaggerErrorExamples.invalidEmailOrPassword.description,
    schema: { example: SwaggerErrorExamples.invalidEmailOrPassword.example },
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: SwaggerErrorExamples.validationError.description,
    schema: { example: SwaggerErrorExamples.validationError.example },
  })
  async handle(
    @Body() authRequest: CreateAuthRequestDTO,
  ): Promise<CreateAuthResponseDTO> {
    return this.authService.execute(authRequest);
  }
}
