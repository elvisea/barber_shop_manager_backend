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
import { Role } from '@prisma/client';

import { EstablishmentProductCreateParamDTO } from '../dtos/establishment-product-create-param.dto';
import { EstablishmentProductCreateRequestDTO } from '../dtos/establishment-product-create-request.dto';
import { EstablishmentProductCreateResponseDTO } from '../dtos/establishment-product-create-response.dto';
import { EstablishmentProductCreateService } from '../services/establishment-product-create.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { EstablishmentMemberGuard } from '@/modules/auth/guards/establishment-member.guard';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Products')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/products')
@UseGuards(JwtAuthGuard, EstablishmentMemberGuard)
@Roles(Role.ADMIN)
export class EstablishmentProductCreateController {
  constructor(
    private readonly establishmentProductCreateService: EstablishmentProductCreateService,
  ) {}

  @Post()
  @ApiOperation({ summary: 'Create product for establishment' })
  @ApiResponse({ status: 201, type: EstablishmentProductCreateResponseDTO })
  @ApiForbiddenResponse({
    description: 'Forbidden: establishment not found or access denied',
    schema: {
      example: {
        statusCode: 403,
        message: 'Establishment not found or access denied',
        error: 'ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED',
      },
    },
  })
  @ApiConflictResponse({
    description: 'Conflict: product name already exists',
    schema: {
      example: {
        statusCode: 409,
        message: 'Product name already exists',
        error: 'ESTABLISHMENT_PRODUCT_NAME_ALREADY_EXISTS',
      },
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: ['name should not be empty', 'price must be an integer'],
        error: 'Bad Request',
      },
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentProductCreateParamDTO,
    @Body() dto: EstablishmentProductCreateRequestDTO,
  ): Promise<EstablishmentProductCreateResponseDTO> {
    return this.establishmentProductCreateService.execute(
      dto,
      params.establishmentId,
      userId,
    );
  }
}
