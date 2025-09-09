import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';

import { CreateUserDocs } from '../docs';
import { CreateUserRequestDTO } from '../dtos/create-user-request.dto';
import { CreateUserResponseDTO } from '../dtos/create-user-response.dto';
import { CreateUserService } from '../services/create-user.service';

@ApiTags('Users')
@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) {}

  @Post()
  @CreateUserDocs()
  async handle(
    @Body() dto: CreateUserRequestDTO,
  ): Promise<CreateUserResponseDTO> {
    return this.createUserService.execute(dto);
  }
}
