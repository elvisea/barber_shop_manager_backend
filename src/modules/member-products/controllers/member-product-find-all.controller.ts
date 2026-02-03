import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { FindAllMemberProductsDocs } from '../docs';
import { MemberProductFindAllParamDTO } from '../dtos/member-product-find-all-param.dto';
import { MemberProductFindAllResponseDTO } from '../dtos/member-product-find-all-response.dto';
import { MemberProductFindAllService } from '../services/member-product-find-all.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Member Products')
@ApiBearerAuth()
@Controller('members/:memberId/products')
@UseGuards(JwtAuthGuard)
export class MemberProductFindAllController {
  constructor(
    private readonly memberProductFindAllService: MemberProductFindAllService,
  ) {}

  @Get()
  @FindAllMemberProductsDocs()
  async handle(
    @GetRequestId() requesterId: string,
    @Param() params: MemberProductFindAllParamDTO,
    @Query() query: BasePaginationQueryDTO,
  ): Promise<MemberProductFindAllResponseDTO> {
    return this.memberProductFindAllService.execute(params, query, requesterId);
  }
}
