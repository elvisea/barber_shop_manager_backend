import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentFindAllQueryDTO } from '../dtos/establishment-find-all-query.dto';
import { EstablishmentFindAllResponseDTO } from '../dtos/establishment-find-all-response.dto';
import { EstablishmentFindAllService } from '../services/establishment-find-all.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentFindAllController {
  constructor(
    private readonly establishmentFindAllService: EstablishmentFindAllService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find establishments (paginated)' })
  @ApiResponse({ status: 200, type: EstablishmentFindAllResponseDTO })
  @ApiBadRequestResponse({
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: ['page must be a positive integer'],
        error: 'Bad Request',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden: user is not allowed to view establishments.',
    schema: {
      example: {
        statusCode: 403,
        message: 'User is not allowed to view establishments',
        error: 'FORBIDDEN',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'No establishments found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'No establishments found',
        error: 'NOT_FOUND',
      },
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Query() query: EstablishmentFindAllQueryDTO,
  ): Promise<EstablishmentFindAllResponseDTO> {
    return this.establishmentFindAllService.execute(query, userId);
  }
}
