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

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';
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
    description: SwaggerErrorExamples.validationError.description,
    schema: { example: SwaggerErrorExamples.validationError.example },
  })
  @ApiForbiddenResponse({
    description:
      SwaggerErrorExamples.establishmentNotFoundOrAccessDenied.description,
    schema: {
      example: SwaggerErrorExamples.establishmentNotFoundOrAccessDenied.example,
    },
  })
  @ApiNotFoundResponse({
    description: SwaggerErrorExamples.establishmentCustomerNotFound.description,
    schema: {
      example: SwaggerErrorExamples.establishmentCustomerNotFound.example,
    },
  })
  @ApiConflictResponse({
    description: 'Conflict: customer email or phone already exists',
    schema: {
      oneOf: [
        {
          example:
            SwaggerErrorExamples.establishmentCustomerEmailAlreadyExists
              .example,
        },
        {
          example:
            SwaggerErrorExamples.establishmentCustomerPhoneAlreadyExists
              .example,
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
