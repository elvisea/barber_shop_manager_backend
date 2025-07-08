import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentServiceCreateParamDTO } from '../dtos/establishment-service-create-param.dto';
import { EstablishmentServiceCreateRequestDTO } from '../dtos/establishment-service-create-request.dto';
import { EstablishmentServiceCreateResponseDTO } from '../dtos/establishment-service-create-response.dto';
import { EstablishmentServiceCreateService } from '../services/establishment-service-create.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Services')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/services')
@UseGuards(JwtAuthGuard)
export class EstablishmentServiceCreateController {
  constructor(
    private readonly establishmentServiceCreateService: EstablishmentServiceCreateService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create a new establishment service' })
  @ApiResponse({ status: 201, type: EstablishmentServiceCreateResponseDTO })
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
  @ApiConflictResponse({
    description:
      SwaggerErrors[ErrorCode.ESTABLISHMENT_SERVICE_NAME_ALREADY_EXISTS]
        .description,
    schema: {
      example:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_SERVICE_NAME_ALREADY_EXISTS]
          .example,
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentServiceCreateParamDTO,
    @Body() dto: EstablishmentServiceCreateRequestDTO,
  ): Promise<EstablishmentServiceCreateResponseDTO> {
    return this.establishmentServiceCreateService.execute(
      dto,
      params.establishmentId,
      userId,
    );
  }
}
