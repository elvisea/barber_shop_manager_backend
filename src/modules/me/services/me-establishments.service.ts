import { Injectable, Logger } from '@nestjs/common';

import { MeIdNameDto } from '../dtos/me-id-name.dto';

import { EstablishmentRepository } from '@/modules/establishment/repositories/establishment.repository';
import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';

const MAX_ESTABLISHMENTS = 500;

/**
 * Lista estabelecimentos em que o usuário é dono ou membro.
 * Destinado ao contexto "me" para o usuário escolher com qual estabelecimento trabalhar.
 * Resolve a necessidade de mostrar uma única lista de todos os estabelecimentos que o usuário pode acessar.
 */
@Injectable()
export class MeEstablishmentsService {
  private readonly logger = new Logger(MeEstablishmentsService.name);

  constructor(
    private readonly establishmentRepository: EstablishmentRepository,
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
  ) {}

  /**
   * Retorna estabelecimentos (id, name) que o usuário possui ou dos quais é membro, mesclados e ordenados por name.
   *
   * @param userId - ID do usuário
   * @returns Lista de {@link MeIdNameDto} ordenada por name, sem duplicatas
   */
  async execute(userId: string): Promise<MeIdNameDto[]> {
    this.logger.log(`Listing establishments for user ${userId}`);

    const [ownedResult, userEstablishments] = await Promise.all([
      this.establishmentRepository.findAllByUserPaginated({
        userId,
        skip: 0,
        take: MAX_ESTABLISHMENTS,
      }),
      this.userEstablishmentRepository.findAllByUserWithRelations(userId),
    ]);

    const byId = new Map<string, MeIdNameDto>();

    for (const e of ownedResult.data) {
      byId.set(e.id, { id: e.id, name: e.name });
    }
    for (const ue of userEstablishments) {
      if (!byId.has(ue.establishment.id)) {
        byId.set(ue.establishment.id, {
          id: ue.establishment.id,
          name: ue.establishment.name,
        });
      }
    }

    const list = Array.from(byId.values()).sort((a, b) =>
      a.name.localeCompare(b.name),
    );
    this.logger.log(`Found ${list.length} establishments for user ${userId}`);
    return list;
  }
}
