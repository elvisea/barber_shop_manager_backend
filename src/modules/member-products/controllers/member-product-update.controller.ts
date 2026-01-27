import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UpdateMemberProductDocs } from '../docs';
import { MemberProductCreateResponseDTO } from '../dtos/member-product-create-response.dto';
import { MemberProductUpdateParamDTO } from '../dtos/member-product-update-param.dto';
import { MemberProductUpdateRequestDTO } from '../dtos/member-product-update-request.dto';
import { MemberProductUpdateService } from '../services/member-product-update.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Member Products')
@ApiBearerAuth()
@Controller(
  'establishments/:establishmentId/members/:memberId/products/:productId',
)
@UseGuards(JwtAuthGuard)
export class MemberProductUpdateController {
  constructor(
    private readonly memberProductUpdateService: MemberProductUpdateService,
  ) {}

  @Patch()
  @UpdateMemberProductDocs()
  async handle(
    @GetRequestId() requesterId: string,
    @Param() params: MemberProductUpdateParamDTO,
    @Body() dto: MemberProductUpdateRequestDTO,
  ): Promise<MemberProductCreateResponseDTO> {
    return this.memberProductUpdateService.execute(dto, params, requesterId);
  }
}
