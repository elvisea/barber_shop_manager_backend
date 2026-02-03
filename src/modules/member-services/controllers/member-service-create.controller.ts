import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateMemberServiceDocs } from '../docs';
import { MemberServiceCreateParamDTO } from '../dtos/member-service-create-param.dto';
import { MemberServiceCreateRequestDTO } from '../dtos/member-service-create-request.dto';
import { MemberServiceCreateResponseDTO } from '../dtos/member-service-create-response.dto';
import { MemberServiceCreateService } from '../services/member-service-create.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Member Services')
@ApiBearerAuth()
@Controller('members/:memberId/services/:serviceId')
@UseGuards(JwtAuthGuard)
export class MemberServiceCreateController {
  constructor(
    private readonly memberServiceCreateService: MemberServiceCreateService,
  ) {}

  @Post()
  @CreateMemberServiceDocs()
  async handle(
    @GetRequestId() requesterId: string,
    @Param() params: MemberServiceCreateParamDTO,
    @Body() dto: MemberServiceCreateRequestDTO,
  ): Promise<MemberServiceCreateResponseDTO> {
    return this.memberServiceCreateService.execute(dto, params, requesterId);
  }
}
