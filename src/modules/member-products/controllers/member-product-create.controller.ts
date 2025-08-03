import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MemberProductCreateParamDTO } from '../dtos/member-product-create-param.dto';
import { MemberProductCreateRequestDTO } from '../dtos/member-product-create-request.dto';
import { MemberProductCreateResponseDTO } from '../dtos/member-product-create-response.dto';
import { MemberProductCreateService } from '../services/member-product-create.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

@ApiTags('Member Products')
@ApiBearerAuth()
@Controller(
  'establishments/:establishmentId/members/:memberId/products/:productId',
)
@UseGuards(JwtAuthGuard)
export class MemberProductCreateController {
  constructor(
    private readonly memberProductCreateService: MemberProductCreateService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Assign a product to a member in an establishment' })
  @ApiResponse({ status: 201, type: MemberProductCreateResponseDTO })
  @ApiBadRequestResponse({
    description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
    schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    schema: {
      oneOf: [
        {
          example:
            SwaggerErrors[ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT].example,
        },
        {
          example:
            SwaggerErrors[ErrorCode.USER_NOT_MEMBER_OF_ESTABLISHMENT].example,
        },
        {
          example:
            SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
              .example,
        },
      ],
    },
  })
  @ApiNotFoundResponse({
    description: 'Not Found',
    schema: {
      oneOf: [
        {
          example:
            SwaggerErrors[ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND].example,
        },
        {
          example:
            SwaggerErrors[ErrorCode.ESTABLISHMENT_PRODUCT_NOT_FOUND].example,
        },
      ],
    },
  })
  @ApiConflictResponse({
    description:
      SwaggerErrors[ErrorCode.MEMBER_PRODUCT_ALREADY_EXISTS].description,
    schema: {
      example: SwaggerErrors[ErrorCode.MEMBER_PRODUCT_ALREADY_EXISTS].example,
    },
  })
  async handle(
    @GetRequestId() requesterId: string,
    @Param() params: MemberProductCreateParamDTO,
    @Body() dto: MemberProductCreateRequestDTO,
  ): Promise<MemberProductCreateResponseDTO> {
    return this.memberProductCreateService.execute(dto, params, requesterId);
  }
}
