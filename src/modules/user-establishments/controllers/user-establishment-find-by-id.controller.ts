import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { MemberResponseDTO } from '../../members/dtos';
import { MemberParamDTO } from '../../members/dtos/member-param.dto';
import { FindUserEstablishmentByIdDocs } from '../docs';
import { UserEstablishmentFindByIdService } from '../services/user-establishment-find-by-id.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('members/:memberId')
@UseGuards(JwtAuthGuard)
export class UserEstablishmentFindByIdController {
  constructor(
    private readonly userEstablishmentFindByIdService: UserEstablishmentFindByIdService,
  ) {}

  @Get()
  @FindUserEstablishmentByIdDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: MemberParamDTO,
  ): Promise<MemberResponseDTO> {
    return this.userEstablishmentFindByIdService.execute(
      params.memberId,
      userId,
    );
  }
}
