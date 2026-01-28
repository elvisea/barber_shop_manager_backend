import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { MemberParamDTO } from '../../members/dtos/member-param.dto';
import { MemberSummaryResponseDTO } from '../../members/dtos/member-summary-response.dto';
import { UserEstablishmentSummaryDocs } from '../docs';
import { UserEstablishmentSummaryService } from '../services/user-establishment-summary.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('members/:memberId/summary')
@UseGuards(JwtAuthGuard)
export class UserEstablishmentSummaryController {
  constructor(
    private readonly userEstablishmentSummaryService: UserEstablishmentSummaryService,
  ) {}

  @Get()
  @UserEstablishmentSummaryDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: MemberParamDTO,
  ): Promise<MemberSummaryResponseDTO> {
    return this.userEstablishmentSummaryService.execute(
      params.memberId,
      userId,
    );
  }
}
