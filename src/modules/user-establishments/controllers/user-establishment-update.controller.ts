import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  MemberParamDTO,
  MemberResponseDTO,
  MemberUpdateRequestDTO,
} from '../../members/dtos';
import { UpdateUserEstablishmentDocs } from '../docs';
import { UserEstablishmentUpdateService } from '../services/user-establishment-update.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('members/:memberId')
@UseGuards(JwtAuthGuard)
export class UserEstablishmentUpdateController {
  constructor(
    private readonly userEstablishmentUpdateService: UserEstablishmentUpdateService,
  ) {}

  @Patch()
  @UpdateUserEstablishmentDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: MemberParamDTO,
    @Body() dto: MemberUpdateRequestDTO,
  ): Promise<MemberResponseDTO> {
    return this.userEstablishmentUpdateService.execute(
      params.memberId,
      dto,
      userId,
    );
  }
}
