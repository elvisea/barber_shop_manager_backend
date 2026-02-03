import { Injectable, Logger } from '@nestjs/common';

import { MeIdNameDto } from '../dtos/me-id-name.dto';

import { UserEstablishmentRepository } from '@/modules/user-establishments/repositories/user-establishment.repository';
import { EstablishmentAccessService } from '@/shared/establishment-access/services/establishment-access.service';

const MAX_ITEMS = 5000;

/**
 * Lista membros (id, name) de um estabelecimento que o usuário pode acessar.
 * Destinado a alimentar selects/combos no contexto "me" (ex.: escolha de barbeiro ou equipe).
 * Resolve a necessidade de mostrar apenas membros do estabelecimento atual com acesso validado.
 */
@Injectable()
export class MeMembersService {
  private readonly logger = new Logger(MeMembersService.name);

  constructor(
    private readonly establishmentAccessService: EstablishmentAccessService,
    private readonly userEstablishmentRepository: UserEstablishmentRepository,
  ) {}

  /**
   * Retorna os membros do estabelecimento como id/name, ordenados por name.
   *
   * @param userId - ID do usuário que faz a requisição
   * @param establishmentId - ID do estabelecimento
   * @returns Lista de {@link MeIdNameDto} ordenada por name
   * @throws CustomHttpException quando o usuário não tem acesso ao estabelecimento
   */
  async execute(
    userId: string,
    establishmentId: string,
  ): Promise<MeIdNameDto[]> {
    this.logger.log(
      `Listing members for user ${userId}, establishment ${establishmentId}`,
    );

    await this.establishmentAccessService.assertUserCanAccessEstablishment(
      userId,
      establishmentId,
    );

    const { data } =
      await this.userEstablishmentRepository.findAllByEstablishmentPaginated({
        establishmentId,
        skip: 0,
        take: MAX_ITEMS,
      });

    return data
      .map((ue) => ({ id: ue.user.id, name: ue.user.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
