import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { BaseEstablishmentParamDTO } from '../../../common/dtos/base-establishment-param';
import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MemberFindAllQueryDTO, MemberPaginatedResponseDTO } from '../dtos';
import { MemberFindAllService } from '../services/member-find-all.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';

@ApiTags('Partners')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/partners')
@UseGuards(JwtAuthGuard)
export class MemberFindAllController {
  constructor(private readonly memberFindAllService: MemberFindAllService) {}

  @Get()
  @ApiOperation({ summary: 'Find all partners with pagination' })
  @ApiResponse({ status: 200, type: MemberPaginatedResponseDTO })
  @ApiNotFoundResponse({
    description: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].description,
    schema: {
      example: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].example,
    },
  })
  @ApiForbiddenResponse({
    description:
      SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].description,
    schema: {
      oneOf: [
        {
          example:
            SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].example,
        },
      ],
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: BaseEstablishmentParamDTO,
    @Query() query: MemberFindAllQueryDTO,
  ): Promise<MemberPaginatedResponseDTO> {
    return this.memberFindAllService.execute(
      params.establishmentId,
      userId,
      query,
    );
  }
}
