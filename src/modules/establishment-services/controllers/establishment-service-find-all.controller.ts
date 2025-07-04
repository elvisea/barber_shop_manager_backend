import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentServiceFindAllParamDTO } from '../dtos/establishment-service-find-all-param.dto';
import { EstablishmentServiceFindAllQueryDTO } from '../dtos/establishment-service-find-all-query.dto';
import { EstablishmentServiceFindAllResponseDTO } from '../dtos/establishment-service-find-all-response.dto';
import { EstablishmentServiceFindAllService } from '../services/establishment-service-find-all.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Services')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/services')
@UseGuards(JwtAuthGuard)
export class EstablishmentServiceFindAllController {
  constructor(
    private readonly establishmentServiceFindAllService: EstablishmentServiceFindAllService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find all services (paginated)' })
  @ApiResponse({ status: 200, type: EstablishmentServiceFindAllResponseDTO })
  @ApiBadRequestResponse({
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: ['establishmentId must be a valid UUID'],
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
    description: 'Establishment not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Establishment not found',
        error: 'ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED',
      },
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentServiceFindAllParamDTO,
    @Query() query: EstablishmentServiceFindAllQueryDTO,
  ): Promise<EstablishmentServiceFindAllResponseDTO> {
    return this.establishmentServiceFindAllService.execute(
      query,
      params.establishmentId,
      userId,
    );
  }
}
