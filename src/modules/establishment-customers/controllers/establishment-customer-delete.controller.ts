import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { DeleteCustomerDocs } from '../docs';
import { EstablishmentCustomerFindByIdParamDTO } from '../dtos/establishment-customer-find-by-id-param.dto';
import { EstablishmentCustomerDeleteService } from '../services/establishment-customer-delete.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Customers')
@ApiBearerAuth()
@Controller('customers/:customerId')
@UseGuards(JwtAuthGuard)
export class EstablishmentCustomerDeleteController {
  constructor(
    private readonly establishmentCustomerDeleteService: EstablishmentCustomerDeleteService,
  ) {}

  @Delete()
  @HttpCode(204)
  @DeleteCustomerDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentCustomerFindByIdParamDTO,
  ): Promise<void> {
    await this.establishmentCustomerDeleteService.execute(
      params.customerId,
      userId,
    );
    // 204 No Content: não retorna body
  }
}
