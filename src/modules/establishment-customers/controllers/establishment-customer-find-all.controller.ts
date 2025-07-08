import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentCustomerFindAllParamDTO } from '../dtos/establishment-customer-find-all-param.dto';
import { EstablishmentCustomerFindAllQueryDTO } from '../dtos/establishment-customer-find-all-query.dto';
import { EstablishmentCustomerFindAllResponseDTO } from '../dtos/establishment-customer-find-all-response.dto';
import { EstablishmentCustomerFindAllService } from '../services/establishment-customer-find-all.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Customers')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/customers')
@UseGuards(JwtAuthGuard)
export class EstablishmentCustomerFindAllController {
  constructor(
    private readonly establishmentCustomerFindAllService: EstablishmentCustomerFindAllService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find all customers (paginated)' })
  @ApiResponse({ status: 200, type: EstablishmentCustomerFindAllResponseDTO })
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
    @Param() params: EstablishmentCustomerFindAllParamDTO,
    @Query() query: EstablishmentCustomerFindAllQueryDTO,
  ): Promise<EstablishmentCustomerFindAllResponseDTO> {
    return this.establishmentCustomerFindAllService.execute(
      query,
      params.establishmentId,
      userId,
    );
  }
}
