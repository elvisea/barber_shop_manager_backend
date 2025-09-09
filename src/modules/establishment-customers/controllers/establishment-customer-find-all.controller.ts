import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { FindAllCustomersDocs } from '../docs';
import { EstablishmentCustomerFindAllQueryDTO } from '../dtos/establishment-customer-find-all-query.dto';
import { EstablishmentCustomerFindAllResponseDTO } from '../dtos/establishment-customer-find-all-response.dto';
import { EstablishmentCustomerParamDTO } from '../dtos/establishment-customer-param.dto';
import { EstablishmentCustomerFindAllService } from '../services/establishment-customer-find-all.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Customers')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/customers')
@UseGuards(JwtAuthGuard)
export class EstablishmentCustomerFindAllController {
  constructor(
    private readonly establishmentCustomerFindAllService: EstablishmentCustomerFindAllService,
  ) {}

  @Get()
  @FindAllCustomersDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentCustomerParamDTO,
    @Query() query: EstablishmentCustomerFindAllQueryDTO,
  ): Promise<EstablishmentCustomerFindAllResponseDTO> {
    return this.establishmentCustomerFindAllService.execute(
      query,
      params.establishmentId,
      userId,
    );
  }
}
