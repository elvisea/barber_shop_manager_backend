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
    description: 'Forbidden: establishment not found or access denied.',
    schema: {
      example: {
        statusCode: 403,
        message: 'Establishment not found or access denied',
        error: 'ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED',
      },
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
