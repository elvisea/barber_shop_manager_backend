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

import { MemberParamDTO } from '../dtos';
import { MemberDeleteService } from '../services/member-delete.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members/:memberId')
@UseGuards(JwtAuthGuard)
export class MemberDeleteController {
  constructor(private readonly memberDeleteService: MemberDeleteService) {}

  @Delete()
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete member' })
  @ApiResponse({ status: 204, description: 'Member deleted successfully' })
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
