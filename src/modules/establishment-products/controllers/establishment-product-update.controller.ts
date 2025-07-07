import { Body, Controller, Param, Patch, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { EstablishmentProductCreateResponseDTO } from '../dtos/establishment-product-create-response.dto';
import { EstablishmentProductFindByIdParamDTO } from '../dtos/establishment-product-find-by-id-param.dto';
import { EstablishmentProductUpdateRequestDTO } from '../dtos/establishment-product-update-request.dto';
import { EstablishmentProductUpdateService } from '../services/establishment-product-update.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { EstablishmentMemberGuard } from '@/modules/auth/guards/establishment-member.guard';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Products')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/products/:productId')
@UseGuards(JwtAuthGuard, EstablishmentMemberGuard)
@Roles(Role.ADMIN)
export class EstablishmentProductUpdateController {
  constructor(
    private readonly establishmentProductUpdateService: EstablishmentProductUpdateService,
  ) {}

  @Patch()
  @ApiOperation({ summary: 'Update product by ID' })
  @ApiResponse({ status: 200, type: EstablishmentProductCreateResponseDTO })
  @ApiBadRequestResponse({
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: ['name should not be empty'],
        error: 'Bad Request',
      },
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden: establishment not found or access denied.',
    schema: {
      example: {
        statusCode: 403,
        message: 'Establishment not found or access denied',
        error: 'ESTABLISHMENT_NOT_FOUND_OR_ACCESS_DENIED',
      },
    },
  })
  @ApiNotFoundResponse({
    description: 'Product or establishment not found.',
    schema: {
      example: {
        statusCode: 404,
        message: 'Product not found',
        error: 'ESTABLISHMENT_PRODUCT_NOT_FOUND',
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
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentProductFindByIdParamDTO,
    @Body() dto: EstablishmentProductUpdateRequestDTO,
  ): Promise<EstablishmentProductCreateResponseDTO> {
    return this.establishmentProductUpdateService.execute(
      params.productId,
      params.establishmentId,
      userId,
      dto,
    );
  }
}
