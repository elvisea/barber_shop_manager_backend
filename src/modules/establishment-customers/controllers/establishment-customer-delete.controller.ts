import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentCustomerFindByIdParamDTO } from '../dtos/establishment-customer-find-by-id-param.dto';
import { EstablishmentCustomerDeleteService } from '../services/establishment-customer-delete.service';

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Customers')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/customers/:customerId')
@UseGuards(JwtAuthGuard)
export class EstablishmentCustomerDeleteController {
  constructor(
    private readonly establishmentCustomerDeleteService: EstablishmentCustomerDeleteService,
  ) { }

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete customer by ID' })
  @ApiNoContentResponse({ description: 'Customer deleted successfully' })
  @ApiBadRequestResponse({
    description: SwaggerErrorExamples.validationError.description,
    schema: { example: SwaggerErrorExamples.validationError.example },
  })
  @ApiForbiddenResponse({
    description: SwaggerErrorExamples.establishmentNotFoundOrAccessDenied.description,
    schema: { example: SwaggerErrorExamples.establishmentNotFoundOrAccessDenied.example },
  })
  @ApiNotFoundResponse({
    description: SwaggerErrorExamples.establishmentCustomerNotFound.description,
    schema: { example: SwaggerErrorExamples.establishmentCustomerNotFound.example },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentCustomerFindByIdParamDTO,
  ): Promise<void> {
    await this.establishmentCustomerDeleteService.execute(
      params.customerId,
      params.establishmentId,
      userId,
    );
    // 204 No Content: não retorna body
  }
}
