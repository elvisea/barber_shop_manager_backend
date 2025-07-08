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

import { EstablishmentMemberFindByIdParamDTO } from '../dtos/establishment-member-find-by-id-param.dto';
import { EstablishmentMemberFindByIdResponseDTO } from '../dtos/establishment-member-find-by-id-response.dto';
import { EstablishmentMemberFindByIdService } from '../services/establishment-member-find-by-id.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members/:userId')
@UseGuards(JwtAuthGuard)
export class EstablishmentMemberFindByIdController {
  constructor(
    private readonly establishmentMemberFindByIdService: EstablishmentMemberFindByIdService,
  ) {}

  @Get()
  @ApiOperation({
    summary: 'Find establishment member by userId and establishmentId',
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
    @Param() params: EstablishmentMemberFindByIdParamDTO,
  ): Promise<EstablishmentMemberFindByIdResponseDTO> {
    return this.establishmentMemberFindByIdService.execute(
      requesterId,
      params.userId,
      params.establishmentId,
    );
  }
}
