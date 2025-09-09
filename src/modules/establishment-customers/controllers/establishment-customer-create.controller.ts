import { Body, Controller, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { CreateCustomerDocs } from '../docs';
import { EstablishmentCustomerCreateRequestDTO } from '../dtos/establishment-customer-create-request.dto';
import { EstablishmentCustomerCreateResponseDTO } from '../dtos/establishment-customer-create-response.dto';
import { EstablishmentCustomerParamDTO } from '../dtos/establishment-customer-param.dto';
import { EstablishmentCustomerCreateService } from '../services/establishment-customer-create.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Customers')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/customers')
@UseGuards(JwtAuthGuard)
export class EstablishmentCustomerCreateController {
  constructor(
    private readonly establishmentCustomerCreateService: EstablishmentCustomerCreateService,
  ) {}

  @Post()
  @CreateCustomerDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentCustomerParamDTO,
    @Body() dto: EstablishmentCustomerCreateRequestDTO,
  ): Promise<EstablishmentCustomerCreateResponseDTO> {
    return this.establishmentCustomerCreateService.execute(
      dto,
      userId,
      params.establishmentId,
    );
  }
}
