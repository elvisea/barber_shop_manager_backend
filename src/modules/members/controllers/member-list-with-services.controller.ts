import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BaseEstablishmentParamDTO } from '../../../common/dtos/base-establishment-param';
import { MemberListWithServicesDocs } from '../docs/member-list-with-services.docs';
import { MemberWithServicesResponseDTO } from '../dtos/member-with-services-response.dto';
import { MemberListWithServicesService } from '../services/member-list-with-services.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members')
@UseGuards(JwtAuthGuard)
export class MemberListWithServicesController {
  constructor(
    private readonly memberListWithServicesService: MemberListWithServicesService,
  ) {}

  @Get('with-services')
  @MemberListWithServicesDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: BaseEstablishmentParamDTO,
  ): Promise<MemberWithServicesResponseDTO[]> {
    return this.memberListWithServicesService.execute(
      params.establishmentId,
      userId,
    );
  }
}
