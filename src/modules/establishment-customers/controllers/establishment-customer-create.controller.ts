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

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Customers')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/customers')
@UseGuards(JwtAuthGuard)
export class EstablishmentCustomerCreateController {
  constructor(
    private readonly establishmentCustomerCreateService: EstablishmentCustomerCreateService,
  ) { }

  @Post()
  @ApiOperation({ summary: 'Create customer for establishment' })
  @ApiResponse({ status: 201, type: EstablishmentCustomerCreateResponseDTO })
  @ApiForbiddenResponse({
    description: SwaggerErrorExamples.establishmentNotFoundOrAccessDenied.description,
    schema: { example: SwaggerErrorExamples.establishmentNotFoundOrAccessDenied.example },
  })
  @ApiConflictResponse({
    description: 'Conflict: customer email or phone already exists',
    schema: {
      oneOf: [
        { example: SwaggerErrorExamples.establishmentCustomerEmailAlreadyExists.example },
        { example: SwaggerErrorExamples.establishmentCustomerPhoneAlreadyExists.example },
      ],
    },
  })
  @ApiBadRequestResponse({
    description: SwaggerErrorExamples.validationError.description,
    schema: { example: SwaggerErrorExamples.validationError.example },
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
