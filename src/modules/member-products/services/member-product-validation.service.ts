import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberProductRepository } from '../repositories/member-product.repository';
import { MemberProductWithRelations } from '../types/member-product-with-relations.type';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

/**
 * Service responsável por validar e buscar MemberProduct com todos os relacionamentos.
 *
 * Este service centraliza as validações comuns que são realizadas em múltiplos services
 * (update, delete, find-one), eliminando duplicação de código e garantindo consistência.
 *
 * **Responsabilidade Única:**
 * Este service é responsável APENAS por validar e buscar MemberProduct existente.
 * Para validar Member + Establishment (usado em operações de criação), utilize
 * `MemberEstablishmentValidationService` do módulo `members`.
 *
 * **Validações Realizadas:**
 * 1. Busca MemberProduct com todos os relacionamentos (Member, Establishment, Product)
 * 2. Verifica se o MemberProduct existe e não está deletado
 * 3. Valida se o Establishment existe (via relacionamento)
 * 4. Verifica se o requester é dono do Establishment
 * 5. Valida se o Member existe no Establishment (via relacionamento)
 *
 * **Benefícios:**
 * - **DRY (Don't Repeat Yourself)**: Elimina duplicação de código
 * - **Manutenibilidade**: Mudanças nas validações em um único lugar
 * - **Testabilidade**: Validações podem ser testadas isoladamente
 * - **Consistência**: Garante que todas as validações são idênticas
 * - **Single Responsibility**: Focado apenas em validação de MemberProduct
 *
 * **Uso:**
 * ```typescript
 * // Para operações que precisam do MemberProduct existente (update, delete, find-one)
 * const memberProductWithRelations =
 *   await this.memberProductValidationService.execute(
 *     params.memberId,
 *     params.establishmentId,
 *     params.productId,
 *     requesterId,
 *   );
 * ```
 *
 * @see MemberProductWithRelations para o tipo de retorno
 * @see MemberEstablishmentValidationService para validação de Member + Establishment
 */
@Injectable()
export class MemberProductValidationService {
  private readonly logger = new Logger(MemberProductValidationService.name);

  constructor(
    private readonly memberProductRepository: MemberProductRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  /**
   * Valida e retorna MemberProduct com todos os relacionamentos.
   *
   * Realiza todas as validações necessárias para garantir que:
   * - O MemberProduct existe e não está deletado
   * - O Establishment existe e pertence ao requester
   * - O Member existe no Establishment
   *
   * **Ordem das Validações:**
   * 1. Busca MemberProduct com relacionamentos
   * 2. Verifica se existe e não está deletado
   * 3. Valida Establishment existe
   * 4. Verifica se requester é dono do Establishment
   * 5. Valida Member existe no Establishment
   *
   * @param memberId - ID do membro
   * @param establishmentId - ID do estabelecimento
   * @param productId - ID do produto
   * @param requesterId - ID do usuário que está fazendo a requisição
   * @returns MemberProduct com todos os relacionamentos carregados
   * @throws CustomHttpException se alguma validação falhar
   */
  async execute(
    memberId: string,
    establishmentId: string,
    productId: string,
    requesterId: string,
  ): Promise<MemberProductWithRelations> {
    // 1. Busca MemberProduct com todos os relacionamentos em uma única query
    const memberProductWithRelations =
      await this.memberProductRepository.findByMemberEstablishmentProductWithRelations(
        memberId,
        establishmentId,
        productId,
      );

    if (!memberProductWithRelations) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_PRODUCT_NOT_FOUND,
        {
          MEMBER_ID: memberId,
          ESTABLISHMENT_ID: establishmentId,
          PRODUCT_ID: productId,
        },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_PRODUCT_NOT_FOUND,
      );
    }

    // 2. Verifica se o MemberProduct está deletado
    if (memberProductWithRelations.deletedAt) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_PRODUCT_NOT_FOUND,
        {
          MEMBER_ID: memberId,
          ESTABLISHMENT_ID: establishmentId,
          PRODUCT_ID: productId,
        },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_PRODUCT_NOT_FOUND,
      );
    }

    // 3. Valida se o Establishment existe (dados já carregados do relacionamento)
    const establishment = memberProductWithRelations.product.establishment;
    const user = memberProductWithRelations.user;

    if (!establishment) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
        { ESTABLISHMENT_ID: establishmentId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_NOT_FOUND,
      );
    }

    // 4. Verifica se o requester é dono do estabelecimento
    if (establishment.ownerId !== requesterId) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
        { ESTABLISHMENT_ID: establishmentId, USER_ID: requesterId },
      );
      this.logger.warn(message);
      throw new CustomHttpException(
        message,
        HttpStatus.FORBIDDEN,
        ErrorCode.ESTABLISHMENT_NOT_OWNED_BY_USER,
      );
    }

    // 5. Valida se o User existe (dados já carregados)
    if (!user) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_NOT_FOUND,
        {
          MEMBER_ID: memberId,
          ESTABLISHMENT_ID: establishmentId,
        },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_NOT_FOUND,
      );
    }

    return memberProductWithRelations;
  }
}
