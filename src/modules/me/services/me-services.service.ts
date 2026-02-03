import { Injectable, Logger } from '@nestjs/common';

import { MeIdNameDto } from '../dtos/me-id-name.dto';

import { EstablishmentServiceRepository } from '@/modules/establishment-services/repositories/establishment-service.repository';
import { EstablishmentAccessService } from '@/shared/establishment-access/services/establishment-access.service';

const MAX_ITEMS = 5000;

/**
 * Lista serviços (id, name) de um estabelecimento que o usuário pode acessar.
 * Destinado a alimentar selects/combos no contexto "me" (ex.: escolha de serviço em formulários).
 * Resolve a necessidade de mostrar apenas serviços do estabelecimento atual com acesso validado.
 */
@Injectable()
export class MeServicesService {
  private readonly logger = new Logger(MeServicesService.name);

  constructor(
    private readonly establishmentAccessService: EstablishmentAccessService,
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
  ) {}

  /**
   * Retorna os serviços do estabelecimento como id/name, ordenados por name.
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
      `Listing services for user ${userId}, establishment ${establishmentId}`,
    );

    await this.establishmentAccessService.assertUserCanAccessEstablishment(
      userId,
      establishmentId,
    );

    const { data } =
      await this.establishmentServiceRepository.findAllByEstablishmentPaginated(
        {
          establishmentId,
          skip: 0,
          take: MAX_ITEMS,
        },
      );

    return data
      .map((s) => ({ id: s.id, name: s.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
