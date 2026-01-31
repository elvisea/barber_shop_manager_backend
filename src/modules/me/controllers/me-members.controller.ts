import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { MeMembersDocs } from '../docs';
import { MeEstablishmentQueryDto } from '../dtos/me-establishment-query.dto';
import { MeIdNameDto } from '../dtos/me-id-name.dto';
import { MeMembersService } from '../services/me-members.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Me')
@ApiBearerAuth()
@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeMembersController {
  constructor(private readonly meMembersService: MeMembersService) {}

  @Get('members')
  @MeMembersDocs()
  async handler(
    @GetRequestId() userId: string,
    @Query() query: MeEstablishmentQueryDto,
  ): Promise<MeIdNameDto[]> {
    return this.meMembersService.execute(userId, query.establishmentId);
  }
}
