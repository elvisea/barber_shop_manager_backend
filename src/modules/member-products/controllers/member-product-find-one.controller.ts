import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { FindOneMemberProductDocs } from '../docs';
import { MemberProductFindOneParamDTO } from '../dtos/member-product-find-one-param.dto';
import { MemberProductFindOneResponseDTO } from '../dtos/member-product-find-one-response.dto';
import { MemberProductFindOneService } from '../services/member-product-find-one.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Member Products')
@ApiBearerAuth()
@Controller(
  'establishments/:establishmentId/members/:memberId/products/:productId',
)
@UseGuards(JwtAuthGuard)
export class MemberProductFindOneController {
  constructor(
    private readonly memberProductFindOneService: MemberProductFindOneService,
  ) {}

  @Get()
  @FindOneMemberProductDocs()
  async handle(
    @GetRequestId() requesterId: string,
    @Param() params: MemberProductFindOneParamDTO,
  ): Promise<MemberProductFindOneResponseDTO> {
    return this.memberProductFindOneService.execute(params, requesterId);
  }
}
