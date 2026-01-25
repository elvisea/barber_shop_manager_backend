import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { FindMemberByIdDocs } from '../docs';
import { MemberResponseDTO } from '../dtos';
import { MemberParamDTO } from '../dtos/member-param.dto';
import { MemberFindByIdService } from '../services/member-find-by-id.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('members/:memberId')
@UseGuards(JwtAuthGuard)
export class MemberFindByIdController {
  constructor(private readonly memberFindByIdService: MemberFindByIdService) {}

  @Get()
  @FindMemberByIdDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: MemberParamDTO,
  ): Promise<MemberResponseDTO> {
    return this.memberFindByIdService.execute(params.memberId, userId);
  }
}
