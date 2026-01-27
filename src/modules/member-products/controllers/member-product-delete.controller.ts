import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { DeleteMemberProductDocs } from '../docs';
import { MemberProductDeleteParamDTO } from '../dtos/member-product-delete-param.dto';
import { MemberProductDeleteService } from '../services/member-product-delete.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Member Products')
@ApiBearerAuth()
@Controller(
  'establishments/:establishmentId/members/:memberId/products/:productId',
)
@UseGuards(JwtAuthGuard)
export class MemberProductDeleteController {
  constructor(
    private readonly memberProductDeleteService: MemberProductDeleteService,
  ) {}

  @Delete()
  @HttpCode(204)
  @DeleteMemberProductDocs()
  async handle(
    @GetRequestId() requesterId: string,
    @Param() params: MemberProductDeleteParamDTO,
  ): Promise<void> {
    await this.memberProductDeleteService.execute(params, requesterId);
  }
}
