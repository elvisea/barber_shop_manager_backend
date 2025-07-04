import { Body, Controller, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentCustomerCreateRequestDTO } from '../dtos/establishment-customer-create-request.dto';
import { EstablishmentCustomerCreateResponseDTO } from '../dtos/establishment-customer-create-response.dto';
import { EstablishmentCustomerCreateService } from '../services/establishment-customer-create.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Customers')
@ApiBearerAuth()
@Controller('establishment-customers')
@UseGuards(JwtAuthGuard)
export class EstablishmentCustomerCreateController {
  constructor(
    private readonly establishmentCustomerCreateService: EstablishmentCustomerCreateService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create customer for establishment' })
  @ApiResponse({ status: 201, type: EstablishmentCustomerCreateResponseDTO })
  @ApiForbiddenResponse({
    description: 'Forbidden: establishment not found or access denied',
    schema: {
      example: {
        statusCode: 403,
        message: 'Establishment not found or access denied',
        error: 'ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED',
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
  @ApiBadRequestResponse({
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: ['name should not be empty', 'email must be a valid email'],
        error: 'Bad Request',
      },
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Body() dto: EstablishmentCustomerCreateRequestDTO,
  ): Promise<EstablishmentCustomerCreateResponseDTO> {
    return this.establishmentCustomerCreateService.execute(dto, userId);
  }
}
