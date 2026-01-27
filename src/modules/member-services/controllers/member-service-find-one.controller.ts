import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { FindOneMemberServiceDocs } from '../docs';
import { MemberServiceFindOneParamDTO } from '../dtos/member-service-find-one-param.dto';
import { MemberServiceFindOneResponseDTO } from '../dtos/member-service-find-one-response.dto';
import { MemberServiceFindOneService } from '../services/member-service-find-one.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Member Services')
@ApiBearerAuth()
@Controller(
  'establishments/:establishmentId/members/:memberId/services/:serviceId',
)
@UseGuards(JwtAuthGuard)
export class MemberServiceFindOneController {
  constructor(
    private readonly memberServiceFindOneService: MemberServiceFindOneService,
  ) {}

  @Get()
  @FindOneMemberServiceDocs()
  async handle(
    @GetRequestId() requesterId: string,
    @Param() params: MemberServiceFindOneParamDTO,
  ): Promise<MemberServiceFindOneResponseDTO> {
    return this.memberServiceFindOneService.execute(params, requesterId);
  }
}
