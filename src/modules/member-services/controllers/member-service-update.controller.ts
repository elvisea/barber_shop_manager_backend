import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UpdateMemberServiceDocs } from '../docs';
import { MemberServiceCreateResponseDTO } from '../dtos/member-service-create-response.dto';
import { MemberServiceUpdateParamDTO } from '../dtos/member-service-update-param.dto';
import { MemberServiceUpdateRequestDTO } from '../dtos/member-service-update-request.dto';
import { MemberServiceUpdateService } from '../services/member-service-update.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Member Services')
@ApiBearerAuth()
@Controller(
  'establishments/:establishmentId/members/:memberId/services/:serviceId',
)
@UseGuards(JwtAuthGuard)
export class MemberServiceUpdateController {
  constructor(
    private readonly memberServiceUpdateService: MemberServiceUpdateService,
  ) {}

  @Patch()
  @UpdateMemberServiceDocs()
  async handle(
    @GetRequestId() requesterId: string,
    @Param() params: MemberServiceUpdateParamDTO,
    @Body() dto: MemberServiceUpdateRequestDTO,
  ): Promise<MemberServiceCreateResponseDTO> {
    return this.memberServiceUpdateService.execute(dto, params, requesterId);
  }
}
