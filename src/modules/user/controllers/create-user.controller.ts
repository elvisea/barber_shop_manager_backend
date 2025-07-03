import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { CreateUserRequestDTO } from '../dtos/create-user-request.dto';
import { CreateUserResponseDTO } from '../dtos/create-user-response.dto';
import { CreateUserService } from '../services/create-user.service';

@ApiTags('Users')
@Controller('users')
export class CreateUserController {
  constructor(private readonly createUserService: CreateUserService) { }

  @Post()
  @ApiOperation({ summary: 'Create new user' })
  @ApiResponse({
    status: 201,
    description: 'User created successfully',
    type: CreateUserResponseDTO
  })
  @ApiResponse({
    status: 409,
    description: 'User already exists with this email'
  })
  @ApiResponse({
    status: 400,
    description: 'Invalid data'
  })
  async handle(@Body() dto: CreateUserRequestDTO): Promise<CreateUserResponseDTO> {
    return this.createUserService.execute(dto);
  }
} 