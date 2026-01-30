import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import {
  MeEstablishmentsDocs,
  MeProductsDocs,
  MeServicesDocs,
  MeCustomersDocs,
  MeMembersDocs,
} from '../docs';
import { MeEstablishmentQueryDto } from '../dtos/me-establishment-query.dto';
import { MeIdNameDto } from '../dtos/me-id-name.dto';
import { MeCustomersService } from '../services/me-customers.service';
import { MeEstablishmentsService } from '../services/me-establishments.service';
import { MeMembersService } from '../services/me-members.service';
import { MeProductsService } from '../services/me-products.service';
import { MeServicesService } from '../services/me-services.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Me')
@ApiBearerAuth()
@Controller('me')
@UseGuards(JwtAuthGuard)
export class MeController {
  constructor(
    private readonly meEstablishmentsService: MeEstablishmentsService,
    private readonly meProductsService: MeProductsService,
    private readonly meServicesService: MeServicesService,
    private readonly meCustomersService: MeCustomersService,
    private readonly meMembersService: MeMembersService,
  ) {}

  @Get('establishments')
  @MeEstablishmentsDocs()
  async getEstablishments(
    @GetRequestId() userId: string,
  ): Promise<MeIdNameDto[]> {
    return this.meEstablishmentsService.execute(userId);
  }

  @Get('products')
  @MeProductsDocs()
  async getProducts(
    @GetRequestId() userId: string,
    @Query() query: MeEstablishmentQueryDto,
  ): Promise<MeIdNameDto[]> {
    return this.meProductsService.execute(userId, query.establishmentId);
  }

  @Get('services')
  @MeServicesDocs()
  async getServices(
    @GetRequestId() userId: string,
    @Query() query: MeEstablishmentQueryDto,
  ): Promise<MeIdNameDto[]> {
    return this.meServicesService.execute(userId, query.establishmentId);
  }

  @Get('customers')
  @MeCustomersDocs()
  async getCustomers(
    @GetRequestId() userId: string,
    @Query() query: MeEstablishmentQueryDto,
  ): Promise<MeIdNameDto[]> {
    return this.meCustomersService.execute(userId, query.establishmentId);
  }

  @Get('members')
  @MeMembersDocs()
  async getMembers(
    @GetRequestId() userId: string,
    @Query() query: MeEstablishmentQueryDto,
  ): Promise<MeIdNameDto[]> {
    return this.meMembersService.execute(userId, query.establishmentId);
  }
}
