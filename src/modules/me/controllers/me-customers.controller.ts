import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { MeCustomersDocs } from '../docs';
import { MeEstablishmentQueryDto } from '../dtos/me-establishment-query.dto';
import { MeIdNameDto } from '../dtos/me-id-name.dto';
import { MeCustomersService } from '../services/me-customers.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Me')
@ApiBearerAuth()
@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeCustomersController {
  constructor(private readonly meCustomersService: MeCustomersService) {}

  @Get('customers')
  @MeCustomersDocs()
  async handler(
    @GetRequestId() userId: string,
    @Query() query: MeEstablishmentQueryDto,
  ): Promise<MeIdNameDto[]> {
    return this.meCustomersService.execute(userId, query.establishmentId);
  }
}
