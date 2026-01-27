import { Injectable, Logger } from '@nestjs/common';

import { MemberProductFindOneParamDTO } from '../dtos/member-product-find-one-param.dto';
import { MemberProductFindOneResponseDTO } from '../dtos/member-product-find-one-response.dto';

import { MemberProductValidationService } from './member-product-validation.service';

/**
 * Service responsável por buscar um MemberProduct específico.
 */
@Injectable()
export class MemberProductFindOneService {
  private readonly logger = new Logger(MemberProductFindOneService.name);

  constructor(
    private readonly memberProductValidationService: MemberProductValidationService,
  ) {}

  /**
   * Busca um MemberProduct específico com todos os relacionamentos.
   *
   * @param params - Parâmetros da rota (memberId, establishmentId, productId)
   * @param requesterId - ID do usuário que está fazendo a requisição
   * @returns DTO com os dados do MemberProduct encontrado
   * @throws CustomHttpException se alguma validação falhar
   */
  async execute(
    params: MemberProductFindOneParamDTO,
    requesterId: string,
  ): Promise<MemberProductFindOneResponseDTO> {
    this.logger.log(
      `Finding member product for member ${params.memberId} in establishment ${params.establishmentId} and product ${params.productId}`,
    );

    // Validações centralizadas em uma única chamada
    const memberProductWithRelations =
      await this.memberProductValidationService.execute(
        params.memberId,
        params.establishmentId,
        params.productId,
        requesterId,
      );

    this.logger.log(`MemberProduct found: ${memberProductWithRelations.id}`);

    return {
      id: memberProductWithRelations.product.id, // Retorna productId para consistência com find-all
      name: memberProductWithRelations.product.name,
      description: memberProductWithRelations.product.description,
      price: memberProductWithRelations.price,
      commission: Number(memberProductWithRelations.commission),
      createdAt: memberProductWithRelations.createdAt,
      updatedAt: memberProductWithRelations.updatedAt,
    };
  }
}
