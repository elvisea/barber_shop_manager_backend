import { Injectable, Logger } from '@nestjs/common';

import { MeIdNameDto } from '../dtos/me-id-name.dto';

import { EstablishmentProductRepository } from '@/modules/establishment-products/repositories/establishment-product.repository';
import { EstablishmentAccessService } from '@/shared/establishment-access/services/establishment-access.service';

const MAX_ITEMS = 5000;

/**
 * Lista produtos (id, name) de um estabelecimento que o usuário pode acessar.
 * Destinado a alimentar selects/combos no contexto "me" (ex.: escolha de produto em formulários).
 * Resolve a necessidade de mostrar apenas produtos do estabelecimento atual com acesso validado.
 */
@Injectable()
export class MeProductsService {
  private readonly logger = new Logger(MeProductsService.name);

  constructor(
    private readonly establishmentAccessService: EstablishmentAccessService,
    private readonly establishmentProductRepository: EstablishmentProductRepository,
  ) {}

  /**
   * Retorna os produtos do estabelecimento como id/name, ordenados por name.
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
      `Listing products for user ${userId}, establishment ${establishmentId}`,
    );

    await this.establishmentAccessService.assertUserCanAccessEstablishment(
      userId,
      establishmentId,
    );

    const { data } =
      await this.establishmentProductRepository.findAllByEstablishmentPaginated(
        {
          establishmentId,
          skip: 0,
          take: MAX_ITEMS,
        },
      );

    return data
      .map((p) => ({ id: p.id, name: p.name }))
      .sort((a, b) => a.name.localeCompare(b.name));
  }
}
