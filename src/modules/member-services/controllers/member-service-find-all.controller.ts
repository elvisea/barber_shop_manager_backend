import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { MemberServiceFindAllParamDTO } from '../dtos/member-service-find-all-param.dto';
import { MemberServiceFindAllResponseDTO } from '../dtos/member-service-find-all-response.dto';
import { MemberServiceFindAllService } from '../services/member-service-find-all.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { BasePaginatedResponseDTO } from '@/common/dtos/base-paginated-response.dto';
import { BasePaginationQueryDTO } from '@/common/dtos/base-pagination-query.dto';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

@ApiTags('Member Services')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members/:memberId/services')
@UseGuards(JwtAuthGuard)
export class MemberServiceFindAllController {
  constructor(
    private readonly memberServiceFindAllService: MemberServiceFindAllService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'List all services assigned to a member in an establishment',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({ status: 200, type: BasePaginatedResponseDTO })
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
      ],
    },
  })
  async handle(
    @GetRequestId() requesterId: string,
    @Param() params: MemberServiceFindAllParamDTO,
    @Query() query: BasePaginationQueryDTO,
  ): Promise<MemberServiceFindAllResponseDTO> {
    return this.memberServiceFindAllService.execute(params, query, requesterId);
  }
}
