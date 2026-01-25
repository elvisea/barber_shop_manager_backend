import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UpdateCustomerDocs } from '../docs';
import { EstablishmentCustomerFindByIdParamDTO } from '../dtos/establishment-customer-find-by-id-param.dto';
import { EstablishmentCustomerUpdateRequestDTO } from '../dtos/establishment-customer-update-request.dto';
import { EstablishmentCustomerUpdateResponseDTO } from '../dtos/establishment-customer-update-response.dto';
import { EstablishmentCustomerUpdateService } from '../services/establishment-customer-update.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Customers')
@ApiBearerAuth()
@Controller('customers/:customerId')
@UseGuards(JwtAuthGuard)
export class EstablishmentCustomerUpdateController {
  constructor(
    private readonly establishmentCustomerUpdateService: EstablishmentCustomerUpdateService,
  ) {}

  @Patch()
  @UpdateCustomerDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentCustomerFindByIdParamDTO,
    @Body() dto: EstablishmentCustomerUpdateRequestDTO,
  ): Promise<EstablishmentCustomerUpdateResponseDTO> {
    return this.establishmentCustomerUpdateService.execute(
      params.customerId,
      userId,
      dto,
    );
  }
}
