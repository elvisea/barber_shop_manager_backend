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

import { GetRequestId } from '../../auth/decorators/get-request-id.decorator';
import { EstablishmentFindOneResponseDTO } from '../dtos/establishment-find-one-response.dto';
import { EstablishmentUpdateParamDTO } from '../dtos/establishment-update-param.dto';
import { EstablishmentUpdateRequestDTO } from '../dtos/establishment-update-request.dto';
import { EstablishmentUpdateService } from '../services/establishment-update.service';

import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentUpdateController {
  constructor(
    private readonly establishmentUpdateService: EstablishmentUpdateService,
  ) {}

  @Patch(':establishmentId')
  @ApiOperation({ summary: 'Update an establishment' })
  @ApiResponse({ status: 200, type: EstablishmentFindOneResponseDTO })
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
        error: 'ESTABLISHMENT_NOT_FOUND',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Conflict: establishment name already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'Establishment name already exists',
        error: 'ESTABLISHMENT_NAME_ALREADY_EXISTS',
      },
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentUpdateParamDTO,
    @Body() dto: EstablishmentUpdateRequestDTO,
  ): Promise<EstablishmentFindOneResponseDTO> {
    return this.establishmentUpdateService.execute(
      params.establishmentId,
      userId,
      dto,
    );
  }
}
