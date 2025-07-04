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

import { EstablishmentServiceCreateResponseDTO } from '../dtos/establishment-service-create-response.dto';
import { EstablishmentServiceFindByIdParamDTO } from '../dtos/establishment-service-find-by-id-param.dto';
import { EstablishmentServiceFindByIdService } from '../services/establishment-service-find-by-id.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Services')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/services/:serviceId')
@UseGuards(JwtAuthGuard)
export class EstablishmentServiceFindByIdController {
  constructor(
    private readonly establishmentServiceFindByIdService: EstablishmentServiceFindByIdService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find service by ID' })
  @ApiResponse({ status: 200, type: EstablishmentServiceCreateResponseDTO })
  @ApiBadRequestResponse({
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: ['serviceId must be a valid UUID'],
        error: 'Bad Request',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden: user is not a member of the establishment.',
    schema: {
      example: {
        statusCode: 403,
        message: 'Establishment not found or access denied',
        error: 'ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Service not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Service not found',
        error: 'ESTABLISHMENT_SERVICE_NOT_FOUND',
      },
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentServiceFindByIdParamDTO,
  ): Promise<EstablishmentServiceCreateResponseDTO> {
    return this.establishmentServiceFindByIdService.execute(
      params.serviceId,
      params.establishmentId,
      userId,
    );
  }
}
