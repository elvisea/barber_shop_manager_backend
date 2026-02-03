import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { DeleteMemberServiceDocs } from '../docs';
import { MemberServiceDeleteParamDTO } from '../dtos/member-service-delete-param.dto';
import { MemberServiceDeleteService } from '../services/member-service-delete.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Member Services')
@ApiBearerAuth()
@Controller('members/:memberId/services/:serviceId')
@UseGuards(JwtAuthGuard)
export class MemberServiceDeleteController {
  constructor(
    private readonly memberServiceDeleteService: MemberServiceDeleteService,
  ) {}

  @Delete()
  @HttpCode(204)
  @DeleteMemberServiceDocs()
  async handle(
    @GetRequestId() requesterId: string,
    @Param() params: MemberServiceDeleteParamDTO,
  ): Promise<void> {
    await this.memberServiceDeleteService.execute(params, requesterId);
  }
}
