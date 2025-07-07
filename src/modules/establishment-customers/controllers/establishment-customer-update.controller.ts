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

import { EstablishmentCustomerCreateResponseDTO } from '../dtos/establishment-customer-create-response.dto';
import { EstablishmentCustomerFindByIdParamDTO } from '../dtos/establishment-customer-find-by-id-param.dto';
import { EstablishmentCustomerUpdateRequestDTO } from '../dtos/establishment-customer-update-request.dto';
import { EstablishmentCustomerUpdateService } from '../services/establishment-customer-update.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Customers')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/customers/:customerId')
@UseGuards(JwtAuthGuard)
export class EstablishmentCustomerUpdateController {
  constructor(
    private readonly establishmentCustomerUpdateService: EstablishmentCustomerUpdateService,
  ) {}

  @Patch()
  @ApiOperation({ summary: 'Update customer by ID' })
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
    description: 'Customer or establishment not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Customer not found',
        error: 'ESTABLISHMENT_CUSTOMER_NOT_FOUND',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Conflict: customer email or phone already exists',
    schema: {
      oneOf: [
        {
          example: {
            statusCode: 409,
            message: 'A customer with email already exists',
            error: 'ESTABLISHMENT_CUSTOMER_EMAIL_ALREADY_EXISTS',
          },
        },
        {
          example: {
            statusCode: 409,
            message: 'A customer with phone already exists',
            error: 'ESTABLISHMENT_CUSTOMER_PHONE_ALREADY_EXISTS',
          },
        },
      ],
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentCustomerFindByIdParamDTO,
    @Body() dto: EstablishmentCustomerUpdateRequestDTO,
  ): Promise<EstablishmentCustomerCreateResponseDTO> {
    return this.establishmentCustomerUpdateService.execute(
      params.customerId,
      params.establishmentId,
      userId,
      dto,
    );
  }
}
