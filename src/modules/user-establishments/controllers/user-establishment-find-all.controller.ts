import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BaseEstablishmentParamDTO } from '../../../common/dtos/base-establishment-param';
import {
  MemberFindAllQueryDTO,
  MemberPaginatedResponseDTO,
} from '../../members/dtos';
import { FindAllUserEstablishmentsDocs } from '../docs';
import { UserEstablishmentFindAllByEstablishmentService } from '../services/user-establishment-find-all-by-establishment.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members')
@UseGuards(JwtAuthGuard)
export class UserEstablishmentFindAllController {
  constructor(
    private readonly userEstablishmentFindAllByEstablishmentService: UserEstablishmentFindAllByEstablishmentService,
  ) {}

  @Get()
  @FindAllUserEstablishmentsDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: BaseEstablishmentParamDTO,
    @Query() query: MemberFindAllQueryDTO,
  ): Promise<MemberPaginatedResponseDTO> {
    return this.userEstablishmentFindAllByEstablishmentService.execute(
      params.establishmentId,
      userId,
      query,
    );
  }
}
