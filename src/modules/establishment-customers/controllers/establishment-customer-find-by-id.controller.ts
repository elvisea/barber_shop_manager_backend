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
import { Role } from '@prisma/client';

import { EstablishmentCustomerCreateResponseDTO } from '../dtos/establishment-customer-create-response.dto';
import { EstablishmentCustomerFindByIdParamDTO } from '../dtos/establishment-customer-find-by-id-param.dto';
import { EstablishmentCustomerFindByIdService } from '../services/establishment-customer-find-by-id.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { EstablishmentMemberGuard } from '@/modules/auth/guards/establishment-member.guard';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Customers')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/customers/:customerId')
@UseGuards(JwtAuthGuard, EstablishmentMemberGuard)
@Roles(Role.ADMIN)
export class EstablishmentCustomerFindByIdController {
  constructor(
    private readonly establishmentCustomerFindByIdService: EstablishmentCustomerFindByIdService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find customer by ID' })
  @ApiResponse({ status: 200, type: EstablishmentCustomerCreateResponseDTO })
  @ApiBadRequestResponse({
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: ['customerId must be a valid UUID'],
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
  @ApiNotFoundResponse({
    description: 'Customer not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Customer not found',
        error: 'ESTABLISHMENT_CUSTOMER_NOT_FOUND',
      },
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentCustomerFindByIdParamDTO,
  ): Promise<EstablishmentCustomerCreateResponseDTO> {
    return this.establishmentCustomerFindByIdService.execute(
      params.customerId,
      params.establishmentId,
      userId,
    );
  }
}
