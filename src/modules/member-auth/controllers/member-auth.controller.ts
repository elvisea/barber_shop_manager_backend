import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { MemberLoginDocs } from '../docs/member-login.docs';
import { MemberAuthRequestDTO } from '../dtos/member-auth-request.dto';
import { MemberAuthResponseDTO } from '../dtos/member-auth-response.dto';
import { MemberAuthService } from '../services/member-auth.service';

@ApiTags('Authentication')
@Controller('member-auth')
export class MemberAuthController {
  constructor(private readonly memberAuthService: MemberAuthService) {}

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @MemberLoginDocs()
  async handle(
    @Body() authRequest: MemberAuthRequestDTO,
  ): Promise<MemberAuthResponseDTO> {
    return this.memberAuthService.execute(authRequest);
  }
}
