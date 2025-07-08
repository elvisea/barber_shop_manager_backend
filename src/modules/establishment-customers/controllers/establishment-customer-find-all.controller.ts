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

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
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
