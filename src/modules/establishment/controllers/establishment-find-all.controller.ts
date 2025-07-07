import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { EstablishmentFindAllQueryDTO } from '../dtos/establishment-find-all-query.dto';
import { EstablishmentFindAllResponseDTO } from '../dtos/establishment-find-all-response.dto';
import { EstablishmentFindAllService } from '../services/establishment-find-all.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { AdminInAnyEstablishmentGuard } from '@/modules/auth/guards/admin-in-any-establishment.guard';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard, AdminInAnyEstablishmentGuard)
@Roles(Role.ADMIN)
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
  async handle(
    @GetRequestId() userId: string,
    @Query() query: EstablishmentFindAllQueryDTO,
  ): Promise<EstablishmentFindAllResponseDTO> {
    return this.establishmentFindAllService.execute(query, userId);
  }
}
