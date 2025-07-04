import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentPaginatedResponse } from '../dtos/establishment-paginated-response.dto';
import { EstablishmentQueryRequestDTO } from '../dtos/establishment-query-request.dto';
import { EstablishmentResponseDTO } from '../dtos/establishment-response.dto';
import { EstablishmentFindService } from '../services/establishment-find.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishments')
@ApiBearerAuth()
@Controller('establishments')
@UseGuards(JwtAuthGuard)
export class EstablishmentFindController {
  constructor(
    private readonly establishmentFindService: EstablishmentFindService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find establishments (paginated or by id)' })
  @ApiResponse({ status: 200, type: EstablishmentPaginatedResponse })
  @ApiResponse({ status: 200, type: EstablishmentResponseDTO })
  async handle(
    @GetRequestId() userId: string,
    @Query() query: EstablishmentQueryRequestDTO,
  ): Promise<EstablishmentPaginatedResponse | EstablishmentResponseDTO> {
    return this.establishmentFindService.execute(query, userId);
  }
}
