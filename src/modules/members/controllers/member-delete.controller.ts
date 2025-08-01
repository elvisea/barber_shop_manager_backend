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
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';
import { MemberParamDTO } from '../dtos';
import { MemberDeleteService } from '../services/member-delete.service';

import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';
import { GetRequestId } from '@/modules/auth/decorators/get-request-id.decorator';

@ApiTags('Partners')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/partners/:memberId')
@UseGuards(JwtAuthGuard)
export class MemberDeleteController {
  constructor(private readonly memberDeleteService: MemberDeleteService) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete partner' })
  @ApiResponse({ status: 204, description: 'Partner deleted successfully' })
  @ApiNotFoundResponse({
    description: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].description,
    schema: {
      example: SwaggerErrors[ErrorCode.MEMBER_NOT_FOUND].example,
    },
  })
  @ApiForbiddenResponse({
    description:
      SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].description,
    schema: {
      oneOf: [
        {
          example:
            SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER].example,
        },
      ],
    },
  })
  async handle(
    @GetRequestId() userId: string,
    @Param() params: MemberParamDTO,
  ): Promise<void> {
    return this.memberDeleteService.execute(
      params.establishmentId,
      params.memberId,
      userId,
    );
  }
}
