import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
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

import { EstablishmentServiceCreateResponseDTO } from '../dtos/establishment-service-create-response.dto';
import { EstablishmentServiceFindByIdParamDTO } from '../dtos/establishment-service-find-by-id-param.dto';
import { EstablishmentServiceUpdateRequestDTO } from '../dtos/establishment-service-update-request.dto';
import { EstablishmentServiceUpdateService } from '../services/establishment-service-update.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Services')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/services/:serviceId')
@UseGuards(JwtAuthGuard)
export class EstablishmentServiceUpdateController {
  constructor(
    private readonly establishmentServiceUpdateService: EstablishmentServiceUpdateService,
  ) {}

  @Patch()
  @ApiOperation({ summary: 'Update service by ID' })
  @ApiResponse({ status: 200, type: EstablishmentServiceCreateResponseDTO })
  @ApiBadRequestResponse({
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: ['name should not be empty'],
        error: 'Bad Request',
      },
    },
  })
  @ApiForbiddenResponse({
    description:
      'Forbidden: user is not a member of the establishment or lacks ADMIN role.',
    schema: {
      example: {
        statusCode: 403,
        message: 'Establishment not found or access denied',
        error: 'ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Service or establishment not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Service not found',
        error: 'ESTABLISHMENT_SERVICE_NOT_FOUND',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Conflict: service name already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'Service name already exists',
        error: 'ESTABLISHMENT_SERVICE_NAME_ALREADY_EXISTS',
      },
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentServiceFindByIdParamDTO,
    @Body() dto: EstablishmentServiceUpdateRequestDTO,
  ): Promise<EstablishmentServiceCreateResponseDTO> {
    return this.establishmentServiceUpdateService.execute(
      params.serviceId,
      params.establishmentId,
      userId,
      dto,
    );
  }
}
