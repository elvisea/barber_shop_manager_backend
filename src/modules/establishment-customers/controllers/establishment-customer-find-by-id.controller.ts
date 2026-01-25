import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { FindCustomerByIdDocs } from '../docs';
import { EstablishmentCustomerCreateResponseDTO } from '../dtos/establishment-customer-create-response.dto';
import { EstablishmentCustomerFindByIdParamDTO } from '../dtos/establishment-customer-find-by-id-param.dto';
import { EstablishmentCustomerFindByIdService } from '../services/establishment-customer-find-by-id.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Customers')
@ApiBearerAuth()
@Controller('customers/:customerId')
@UseGuards(JwtAuthGuard)
export class EstablishmentCustomerFindByIdController {
  constructor(
    private readonly establishmentCustomerFindByIdService: EstablishmentCustomerFindByIdService,
  ) {}

  @Get()
  @FindCustomerByIdDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentCustomerFindByIdParamDTO,
  ): Promise<EstablishmentCustomerCreateResponseDTO> {
    return this.establishmentCustomerFindByIdService.execute(
      params.customerId,
      userId,
    );
  }
}
