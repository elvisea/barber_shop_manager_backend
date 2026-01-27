import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { MemberSummaryDocs } from '../docs';
import { MemberParamDTO } from '../dtos/member-param.dto';
import { MemberSummaryResponseDTO } from '../dtos/member-summary-response.dto';
import { MemberSummaryService } from '../services/member-summary.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('members/:memberId/summary')
@UseGuards(JwtAuthGuard)
export class MemberSummaryController {
  constructor(private readonly memberSummaryService: MemberSummaryService) {}

  @Get()
  @MemberSummaryDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: MemberParamDTO,
  ): Promise<MemberSummaryResponseDTO> {
    return this.memberSummaryService.execute(params.memberId, userId);
  }
}
