import { ApiProperty } from '@nestjs/swagger';

/**
 * DTO enxuto para itens de seletor (id + name).
 * Usado em todas as rotas GET /me/* para popular selects no frontend.
 */
export class MeIdNameDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string;

  @ApiProperty({ example: 'Barbearia do João' })
  name: string;
}
