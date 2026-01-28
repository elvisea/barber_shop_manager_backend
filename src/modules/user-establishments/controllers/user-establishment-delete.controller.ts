import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { MemberParamDTO } from '../../members/dtos/member-param.dto';
import { DeleteUserEstablishmentDocs } from '../docs';
import { UserEstablishmentDeleteService } from '../services/user-establishment-delete.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('members/:memberId')
@UseGuards(JwtAuthGuard)
export class UserEstablishmentDeleteController {
  constructor(
    private readonly userEstablishmentDeleteService: UserEstablishmentDeleteService,
  ) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteUserEstablishmentDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: MemberParamDTO,
  ): Promise<void> {
    return this.userEstablishmentDeleteService.execute(params.memberId, userId);
  }
}
