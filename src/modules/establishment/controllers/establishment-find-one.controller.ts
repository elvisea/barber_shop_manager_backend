import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentFindOneParamDTO } from '../dtos/establishment-find-one-param.dto';
import { EstablishmentFindOneResponseDTO } from '../dtos/establishment-find-one-response.dto';
import { EstablishmentFindOneService } from '../services/establishment-find-one.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentFindOneController {
  constructor(
    private readonly establishmentFindOneService: EstablishmentFindOneService,
  ) {}

  @Get(':establishmentId')
  @ApiOperation({ summary: 'Find establishment by id' })
  @ApiResponse({ status: 200, type: EstablishmentFindOneResponseDTO })
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
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentFindOneParamDTO,
  ): Promise<EstablishmentFindOneResponseDTO> {
    return this.establishmentFindOneService.execute(
      params.establishmentId,
      userId,
    );
  }
}
