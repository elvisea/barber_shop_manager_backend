import { applyDecorators } from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';

import { MeIdNameDto } from '../dtos/me-id-name.dto';

/**
 * Documentação Swagger para GET /me/establishments
 */
export function MeEstablishmentsDocs() {
  return applyDecorators(
    ApiOperation({
      summary: 'List my establishments (id + name)',
      description:
        'Lista estabelecimentos dos quais o usuário faz parte (owner ou member). Retorna apenas id e name para uso em seletores.',
    }),
    ApiResponse({
      status: 200,
      description: 'Lista de estabelecimentos',
      type: [MeIdNameDto],
    }),
  );
}
