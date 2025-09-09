import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BaseEstablishmentParamDTO } from '../../../common/dtos/base-establishment-param';
import { CreateMemberDocs } from '../docs';
import { MemberCreateRequestDTO, MemberResponseDTO } from '../dtos';
import { MemberCreateService } from '../services/member-create.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members')
@UseGuards(JwtAuthGuard)
export class MemberCreateController {
  constructor(private readonly memberCreateService: MemberCreateService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateMemberDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: BaseEstablishmentParamDTO,
    @Body() dto: MemberCreateRequestDTO,
  ): Promise<MemberResponseDTO> {
    return this.memberCreateService.execute(
      dto,
      params.establishmentId,
      userId,
    );
  }
}
