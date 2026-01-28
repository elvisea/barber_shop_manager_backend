import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { RefreshDocs } from '../docs/refresh.docs';
import { RefreshTokenRequestDTO } from '../dtos/refresh-token-request.dto';
import { RefreshTokenRefreshService } from '../services/refresh-token-refresh.service';

import {
  GetRequestClientInfo,
  RequestClientInfo,
} from '@/common/decorators/get-request-client-info.decorator';
import { BaseAuthResponseDTO } from '@/common/dtos/base-auth-response.dto';

@ApiTags('Refresh Token')
@Controller('refresh')
export class RefreshController {
  constructor(
    private readonly refreshTokenRefreshService: RefreshTokenRefreshService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.OK)
  @RefreshDocs()
  async handle(
    @Body() dto: RefreshTokenRequestDTO,
    @GetRequestClientInfo() clientInfo: RequestClientInfo,
  ): Promise<BaseAuthResponseDTO> {
    return this.refreshTokenRefreshService.execute(
      dto,
      clientInfo.ipAddress,
      clientInfo.userAgent,
    );
  }
}
