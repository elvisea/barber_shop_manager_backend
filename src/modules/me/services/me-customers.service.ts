import { Injectable, Logger } from '@nestjs/common';

import { MeIdNameDto } from '../dtos/me-id-name.dto';

import { EstablishmentCustomerRepository } from '@/modules/establishment-customers/repositories/establishment-customer.repository';
import { EstablishmentAccessService } from '@/shared/establishment-access/services/establishment-access.service';

const MAX_ITEMS = 5000;

/**
 * Lista clientes (id, name) de um estabelecimento que o usuário pode acessar.
 * Destinado a alimentar selects/combos no contexto "me" (ex.: escolha de cliente em formulários).
 * Resolve a necessidade de mostrar apenas clientes do estabelecimento atual com acesso validado.
 */
@Injectable()
export class MeCustomersService {
  private readonly logger = new Logger(MeCustomersService.name);

  constructor(
    private readonly establishmentAccessService: EstablishmentAccessService,
    private readonly establishmentCustomerRepository: EstablishmentCustomerRepository,
  ) {}

  /**
   * Retorna os clientes do estabelecimento como id/name, ordenados por name.
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
      `Listing customers for user ${userId}, establishment ${establishmentId}`,
    );

    await this.establishmentAccessService.assertUserCanAccessEstablishment(
      userId,
      establishmentId,
    );

    const { data } =
      await this.establishmentCustomerRepository.findAllByEstablishmentPaginated(
        {
          establishmentId,
          skip: 0,
          take: MAX_ITEMS,
        },
      );

    return data
      .map((c) => ({ id: c.id, name: c.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
