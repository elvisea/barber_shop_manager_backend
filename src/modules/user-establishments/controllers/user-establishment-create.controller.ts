import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { BaseEstablishmentParamDTO } from '../../../common/dtos/base-establishment-param';
import { MemberCreateRequestDTO, MemberResponseDTO } from '../../members/dtos';
import { CreateUserEstablishmentDocs } from '../docs';
import { UserEstablishmentCreateService } from '../services/user-establishment-create.service';

import { GetRequestId } from '@/common/decorators/get-request-id.decorator';
import { JwtAuthGuard } from '@/common/guards/jwt-auth.guard';

@ApiTags('Establishment Members')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/members')
@UseGuards(JwtAuthGuard)
export class UserEstablishmentCreateController {
  constructor(
    private readonly userEstablishmentCreateService: UserEstablishmentCreateService,
  ) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @CreateUserEstablishmentDocs()
  async handle(
    @GetRequestId() userId: string,
    @Param() params: BaseEstablishmentParamDTO,
    @Body() dto: MemberCreateRequestDTO,
  ): Promise<MemberResponseDTO> {
    return this.userEstablishmentCreateService.execute(
      dto,
      params.establishmentId,
      userId,
    );
  }
}
