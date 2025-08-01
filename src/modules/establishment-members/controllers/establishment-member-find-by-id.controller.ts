import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentMemberFindByIdResponseDTO } from '../dtos/establishment-member-find-by-id-response.dto';
import { EstablishmentMemberParamDTO } from '../dtos/establishment-member-param.dto';
import { EstablishmentMemberFindByIdService } from '../services/establishment-member-find-by-id.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members/:memberId')
@UseGuards(JwtAuthGuard)
export class EstablishmentMemberFindByIdController {
  constructor(
    private readonly establishmentMemberFindByIdService: EstablishmentMemberFindByIdService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Find establishment member by memberId and establishmentId',
  })
  @ApiResponse({ status: 200, type: EstablishmentMemberFindByIdResponseDTO })
  @ApiBadRequestResponse({
    description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
    schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
  })
  @ApiForbiddenResponse({
    description:
      SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
        .description,
    schema: {
      example:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
          .example,
    },
  })
  @ApiNotFoundResponse({
    description:
      SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
        .description,
    schema: {
      example:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
          .example,
    },
  })
  async handle(
    @GetRequestId() requesterId: string,
    @Param() params: EstablishmentMemberParamDTO,
  ): Promise<EstablishmentMemberFindByIdResponseDTO> {
    return this.establishmentMemberFindByIdService.execute(
      requesterId,
      params.memberId,
      params.establishmentId,
    );
  }
}
