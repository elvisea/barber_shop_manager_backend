import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { DeleteMemberDocs } from '../docs';
import { MemberParamDTO } from '../dtos';
import { MemberDeleteService } from '../services/member-delete.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('members/:memberId')
@UseGuards(JwtAuthGuard)
export class MemberDeleteController {
  constructor(private readonly memberDeleteService: MemberDeleteService) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @DeleteMemberDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: MemberParamDTO,
  ): Promise<void> {
    return this.memberDeleteService.execute(params.memberId, userId);
  }
}
