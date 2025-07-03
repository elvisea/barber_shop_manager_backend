import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserRequestDTO } from '../dtos/create-user-request.dto';
import { CreateUserResponseDTO } from '../dtos/create-user-response.dto';
import { CreateUserService } from '../services/create-user.service';

@ApiTags('Usuários')
@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) { }

  @Post()
  @ApiOperation({ summary: 'Criar novo usuário' })
  @ApiResponse({
    status: 201,
    description: 'Usuário criado com sucesso',
    type: CreateUserResponseDTO
  })
  @ApiResponse({
    status: 409,
    description: 'Usuário já existe com este email'
  })
  @ApiResponse({
    status: 400,
    description: 'Dados inválidos'
  })
  async handle(@Body() dto: CreateUserRequestDTO): Promise<CreateUserResponseDTO> {
    return this.createUserService.execute(dto);
  }
} 