import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiConflictResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

import { BaseEstablishmentParamDTO } from '../../../common/dtos/base-establishment-param';
import { MemberCreateRequestDTO, MemberResponseDTO } from '../dtos';
import { MemberCreateService } from '../services/member-create.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';
import { SwaggerErrors } from '@/common/swagger-errors';
import { ErrorCode } from '@/enums/error-code';

@ApiTags('Partners')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/partners')
@UseGuards(JwtAuthGuard)
export class MemberCreateController {
  constructor(private readonly memberCreateService: MemberCreateService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new partner' })
  @ApiResponse({ status: 201, type: MemberResponseDTO })
  @ApiConflictResponse({
    description:
      SwaggerErrors[ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS].description,
    schema: {
      example: SwaggerErrors[ErrorCode.MEMBER_EMAIL_ALREADY_EXISTS].example,
    },
  })
  @ApiConflictResponse({
    description:
      SwaggerErrors[ErrorCode.MEMBER_PHONE_ALREADY_EXISTS].description,
    schema: {
      example: SwaggerErrors[ErrorCode.MEMBER_PHONE_ALREADY_EXISTS].example,
    },
  })
  @ApiNotFoundResponse({
    description: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].description,
    schema: {
      example: SwaggerErrors[ErrorCode.ESTABLISHMENT_NOT_FOUND].example,
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
    @Param() params: BaseEstablishmentParamDTO,
    @Body() dto: MemberCreateRequestDTO,
  ): Promise<MemberResponseDTO> {
    return this.memberCreateService.execute(
      dto,
      params.establishmentId,
      userId,
    );
  }
}
