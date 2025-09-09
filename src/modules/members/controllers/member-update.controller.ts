import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UpdateMemberDocs } from '../docs';
import {
  MemberParamDTO,
  MemberResponseDTO,
  MemberUpdateRequestDTO,
} from '../dtos';
import { MemberUpdateService } from '../services/member-update.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members/:memberId')
@UseGuards(JwtAuthGuard)
export class MemberUpdateController {
  constructor(private readonly memberUpdateService: MemberUpdateService) {}

  @Patch()
  @UpdateMemberDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: MemberParamDTO,
    @Body() dto: MemberUpdateRequestDTO,
  ): Promise<MemberResponseDTO> {
    return this.memberUpdateService.execute(
      params.establishmentId,
      params.memberId,
      dto,
      userId,
    );
  }
}
