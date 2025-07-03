import { ApiProperty } from '@nestjs/swagger';

export class CreateUserResponseDTO {
  @ApiProperty({
    example: 'cm0abc123def456ghi789',
    description: 'ID único do usuário'
  })
  id: string;

  @ApiProperty({
    example: 'João da Silva',
    description: 'Nome completo do usuário'
  })
  name: string;

  @ApiProperty({
    example: 'joao.silva@email.com',
    description: 'Email do usuário'
  })
  email: string;

  @ApiProperty({
    example: '11999999999',
    description: 'Telefone do usuário'
  })
  phone: string;

  @ApiProperty({
    example: '2024-01-21T10:00:00Z',
    description: 'Data de criação do usuário'
  })
  createdAt: Date;

  @ApiProperty({
    example: '2024-01-21T10:00:00Z',
    description: 'Data de última atualização do usuário'
  })
  updatedAt: Date;
} 