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

import { EstablishmentCustomerCreateResponseDTO } from '../dtos/establishment-customer-create-response.dto';
import { EstablishmentCustomerFindByIdParamDTO } from '../dtos/establishment-customer-find-by-id-param.dto';
import { EstablishmentCustomerFindByIdService } from '../services/establishment-customer-find-by-id.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Customers')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/customers/:customerId')
@UseGuards(JwtAuthGuard)
export class EstablishmentCustomerFindByIdController {
  constructor(
    private readonly establishmentCustomerFindByIdService: EstablishmentCustomerFindByIdService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Find customer by ID' })
  @ApiResponse({ status: 200, type: EstablishmentCustomerCreateResponseDTO })
  @ApiBadRequestResponse({
    description: SwaggerErrors[ErrorCode.VALIDATION_ERROR].description,
    schema: { example: SwaggerErrors[ErrorCode.VALIDATION_ERROR].example },
  })
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
  @ApiNotFoundResponse({
    description:
      SwaggerErrors[ErrorCode.ESTABLISHMENT_CUSTOMER_NOT_FOUND].description,
    schema: {
      example:
        SwaggerErrors[ErrorCode.ESTABLISHMENT_CUSTOMER_NOT_FOUND].example,
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
