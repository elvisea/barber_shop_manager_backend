import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { EstablishmentMemberParamDTO } from '../dtos/establishment-member-param.dto';
import { EstablishmentMemberDeleteService } from '../services/establishment-member-delete.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members')
@UseGuards(JwtAuthGuard)
export class EstablishmentMemberDeleteController {
  constructor(
    private readonly establishmentMemberDeleteService: EstablishmentMemberDeleteService,
  ) {}

  @Delete(':memberId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an establishment member' })
  @ApiNoContentResponse({ description: 'Member deleted successfully' })
  @ApiNotFoundResponse({
    description: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].description,
    schema: {
      example: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].example,
    },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    schema: {
      oneOf: [
        {
          example:
            SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].example,
        },
        {
          example:
            SwaggerErrors[ErrorCode.USER_NOT_ADMIN_IN_ESTABLISHMENT].example,
        },
      ],
    },
  })
  async handle(
    @Param() params: EstablishmentMemberParamDTO,
    @GetRequestId() userId: string,
  ): Promise<void> {
    await this.establishmentMemberDeleteService.execute(
      params.establishmentId,
      params.memberId,
      userId,
    );
  }
}
