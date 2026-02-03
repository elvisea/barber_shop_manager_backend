import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { FindAllMemberServicesDocs } from '../docs';
import { MemberServiceFindAllParamDTO } from '../dtos/member-service-find-all-param.dto';
import { MemberServiceFindAllResponseDTO } from '../dtos/member-service-find-all-response.dto';
import { MemberServiceFindAllService } from '../services/member-service-find-all.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Member Services')
@ApiBearerAuth()
@Controller('members/:memberId/services')
@UseGuards(JwtAuthGuard)
export class MemberServiceFindAllController {
  constructor(
    private readonly memberServiceFindAllService: MemberServiceFindAllService,
  ) {}

  @Get()
  @FindAllMemberServicesDocs()
  async handle(
    @GetRequestId() requesterId: string,
    @Param() params: MemberServiceFindAllParamDTO,
    @Query() query: BasePaginationQueryDTO,
  ): Promise<MemberServiceFindAllResponseDTO> {
    return this.memberServiceFindAllService.execute(params, query, requesterId);
  }
}
