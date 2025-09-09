import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateMemberProductDocs } from '../docs/create-member-product.docs';
import { MemberProductCreateParamDTO } from '../dtos/member-product-create-param.dto';
import { MemberProductCreateRequestDTO } from '../dtos/member-product-create-request.dto';
import { MemberProductCreateResponseDTO } from '../dtos/member-product-create-response.dto';
import { MemberProductCreateService } from '../services/member-product-create.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Member Products')
@Controller(
  'establishments/:establishmentId/members/:memberId/products/:productId',
)
@UseGuards(JwtAuthGuard)
export class MemberProductCreateController {
  constructor(
    private readonly memberProductCreateService: MemberProductCreateService,
  ) {}

  @Post()
  @CreateMemberProductDocs()
  async handle(
    @GetRequestId() requesterId: string,
    @Param() params: MemberProductCreateParamDTO,
    @Body() dto: MemberProductCreateRequestDTO,
  ): Promise<MemberProductCreateResponseDTO> {
    return this.memberProductCreateService.execute(dto, params, requesterId);
  }
}
