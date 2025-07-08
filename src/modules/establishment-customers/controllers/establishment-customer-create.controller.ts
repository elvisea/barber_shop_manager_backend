import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentCustomerCreateParamDTO } from '../dtos/establishment-customer-create-param.dto';
import { EstablishmentCustomerCreateRequestDTO } from '../dtos/establishment-customer-create-request.dto';
import { EstablishmentCustomerCreateResponseDTO } from '../dtos/establishment-customer-create-response.dto';
import { EstablishmentCustomerCreateService } from '../services/establishment-customer-create.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Customers')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/customers')
@UseGuards(JwtAuthGuard)
export class EstablishmentCustomerCreateController {
  constructor(
    private readonly establishmentCustomerCreateService: EstablishmentCustomerCreateService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create customer for establishment' })
  @ApiResponse({ status: 201, type: EstablishmentCustomerCreateResponseDTO })
  @ApiForbiddenResponse({
    description:
      SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
        .description,
    schema: {
      example:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED]
          .example,
    },
  })
  @ApiConflictResponse({
    description: 'Conflict: customer email or phone already exists',
    schema: {
      oneOf: [
        {
          example:
            SwaggerErrors[ErrorCode.ESTABLISHMENT_CUSTOMER_EMAIL_ALREADY_EXISTS]
              .example,
        },
        {
          example:
            SwaggerErrors[ErrorCode.ESTABLISHMENT_CUSTOMER_PHONE_ALREADY_EXISTS]
              .example,
        },
      ],
    },
  })
  @ApiBadRequestResponse({
    description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
    schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentCustomerCreateParamDTO,
    @Body() dto: EstablishmentCustomerCreateRequestDTO,
  ): Promise<EstablishmentCustomerCreateResponseDTO> {
    return this.establishmentCustomerCreateService.execute(
      dto,
      userId,
      params.establishmentId,
    );
  }
}
