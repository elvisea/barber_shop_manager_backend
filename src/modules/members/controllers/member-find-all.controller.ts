import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BaseEstablishmentParamDTO } from '../../../common/dtos/base-establishment-param';
import { FindAllMembersDocs } from '../docs';
import { MemberFindAllQueryDTO, MemberPaginatedResponseDTO } from '../dtos';
import { MemberFindAllService } from '../services/member-find-all.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members')
@UseGuards(JwtAuthGuard)
export class MemberFindAllController {
  constructor(private readonly memberFindAllService: MemberFindAllService) {}

  @Get()
  @FindAllMembersDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: BaseEstablishmentParamDTO,
    @Query() query: MemberFindAllQueryDTO,
  ): Promise<MemberPaginatedResponseDTO> {
    return this.memberFindAllService.execute(
      params.establishmentId,
      userId,
      query,
    );
  }
}
