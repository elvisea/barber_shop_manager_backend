import { Controller, Delete, HttpCode, Param, UseGuards } from '@nestjs/common';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { Role } from '@prisma/client';

import { EstablishmentProductFindByIdParamDTO } from '../dtos/establishment-product-find-by-id-param.dto';
import { EstablishmentProductDeleteService } from '../services/establishment-product-delete.service';

import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';
import { Roles } from '@/modules/auth/decorators/roles.decorator';
import { EstablishmentMemberGuard } from '@/modules/auth/guards/establishment-member.guard';
import { JwtAuthGuard } from '@/modules/auth/guards/jwt-auth.guard';

@ApiTags('Establishment Products')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/products/:productId')
@UseGuards(JwtAuthGuard, EstablishmentMemberGuard)
@Roles(Role.ADMIN)
export class EstablishmentProductDeleteController {
  constructor(
    private readonly establishmentProductDeleteService: EstablishmentProductDeleteService,
  ) {}

  @Delete()
  @HttpCode(204)
  @ApiOperation({ summary: 'Delete product by ID' })
  @ApiNoContentResponse({ description: 'Product deleted successfully' })
  @ApiBadRequestResponse({
    description: 'Validation error',
    schema: {
      example: {
        statusCode: 400,
        message: ['productId must be a valid UUID'],
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
  async handle(
    @GetRequestId() userId: string,
    @Param() params: EstablishmentProductFindByIdParamDTO,
  ): Promise<void> {
    await this.establishmentProductDeleteService.execute(
      params.productId,
      params.establishmentId,
      userId,
    );
    // 204 No Content: não retorna body
  }
}
