import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { LoginDocs } from '../docs/login.docs';
import { CreateAuthRequestDTO } from '../dtos/create-auth-request.dto';
import { CreateAuthResponseDTO } from '../dtos/create-auth-response.dto';
import { AuthService } from '../services/auth.service';

@ApiTags('Authentication')
@Controller('user-auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @LoginDocs()
  async handle(
    @Body() authRequest: CreateAuthRequestDTO,
  ): Promise<CreateAuthResponseDTO> {
    return this.authService.execute(authRequest);
  }
}
