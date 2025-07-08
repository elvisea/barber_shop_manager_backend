import {
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
  Param,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';

import { EstablishmentMemberDeleteParamDTO } from '../dtos/establishment-member-delete-param.dto';
import { EstablishmentMemberDeleteService } from '../services/establishment-member-delete.service';

import { SwaggerErrorExamples } from '@/common/swagger-error-examples';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members')
export class EstablishmentMemberDeleteController {
  constructor(
    private readonly establishmentMemberDeleteService: EstablishmentMemberDeleteService,
  ) {}

  @Delete(':userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an establishment member' })
  @ApiNoContentResponse({ description: 'Member deleted successfully' })
  @ApiNotFoundResponse({
    description: SwaggerErrorExamples.establishmentNotFound.description,
    schema: { example: SwaggerErrorExamples.establishmentNotFound.example },
  })
  @ApiForbiddenResponse({
    description: 'Forbidden',
    schema: {
      oneOf: [
        { example: SwaggerErrorExamples.establishmentNotOwnedByUser.example },
        { example: SwaggerErrorExamples.userNotAdminInEstablishment.example },
      ],
    },
  })
  async handle(
    @Param() params: EstablishmentMemberDeleteParamDTO,
    @GetRequestId() userId: string,
  ): Promise<void> {
    await this.establishmentMemberDeleteService.execute(
      params.establishmentId,
      params.userId,
      userId,
    );
  }
}
