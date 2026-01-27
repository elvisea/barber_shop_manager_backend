import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberServiceRepository } from '../repositories/member-service.repository';
import { MemberServiceWithRelations } from '../types/member-service-with-relations.type';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';

/**
 * Service responsável por validar e buscar MemberService com todos os relacionamentos.
 *
 * Este service centraliza as validações comuns que são realizadas em múltiplos services
 * (update, delete, find-one), eliminando duplicação de código e garantindo consistência.
 *
 * **Responsabilidade Única:**
 * Este service é responsável APENAS por validar e buscar MemberService existente.
 * Para validar Member + Establishment (usado em operações de criação), utilize
 * `MemberEstablishmentValidationService` do módulo `members`.
 *
 * **Validações Realizadas:**
 * 1. Busca MemberService com todos os relacionamentos (Member, Establishment, Service)
 * 2. Verifica se o MemberService existe e não está deletado
 * 3. Valida se o Establishment existe (via relacionamento)
 * 4. Verifica se o requester é dono do Establishment
 * 5. Valida se o Member existe no Establishment (via relacionamento)
 *
 * **Benefícios:**
 * - **DRY (Don't Repeat Yourself)**: Elimina duplicação de código
 * - **Manutenibilidade**: Mudanças nas validações em um único lugar
 * - **Testabilidade**: Validações podem ser testadas isoladamente
 * - **Consistência**: Garante que todas as validações são idênticas
 * - **Single Responsibility**: Focado apenas em validação de MemberService
 *
 * **Uso:**
 * ```typescript
 * // Para operações que precisam do MemberService existente (update, delete, find-one)
 * const memberServiceWithRelations =
 *   await this.memberServiceValidationService.execute(
 *     params.memberId,
 *     params.establishmentId,
 *     params.serviceId,
 *     requesterId,
 *   );
 * ```
 *
 * @see MemberServiceWithRelations para o tipo de retorno
 * @see MemberEstablishmentValidationService para validação de Member + Establishment
 */
@Injectable()
export class MemberServiceValidationService {
  private readonly logger = new Logger(MemberServiceValidationService.name);

  constructor(
    private readonly memberServiceRepository: MemberServiceRepository,
    private readonly errorMessageService: ErrorMessageService,
  ) {}

  /**
   * Valida e retorna MemberService com todos os relacionamentos.
   *
   * Realiza todas as validações necessárias para garantir que:
   * - O MemberService existe e não está deletado
   * - O Establishment existe e pertence ao requester
   * - O Member existe no Establishment
   *
   * **Ordem das Validações:**
   * 1. Busca MemberService com relacionamentos
   * 2. Verifica se existe e não está deletado
   * 3. Valida Establishment existe
   * 4. Verifica se requester é dono do Establishment
   * 5. Valida Member existe no Establishment
   *
   * @param memberId - ID do membro
   * @param establishmentId - ID do estabelecimento
   * @param serviceId - ID do serviço
   * @param requesterId - ID do usuário que está fazendo a requisição
   * @returns MemberService com todos os relacionamentos carregados
   * @throws CustomHttpException se alguma validação falhar
   */
  async execute(
    memberId: string,
    establishmentId: string,
    serviceId: string,
    requesterId: string,
  ): Promise<MemberServiceWithRelations> {
    // 1. Busca MemberService com todos os relacionamentos em uma única query
    const memberServiceWithRelations =
      await this.memberServiceRepository.findByMemberEstablishmentServiceWithRelations(
        memberId,
        establishmentId,
        serviceId,
      );

    if (!memberServiceWithRelations) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_SERVICE_NOT_FOUND,
        {
          MEMBER_ID: memberId,
          ESTABLISHMENT_ID: establishmentId,
          SERVICE_ID: serviceId,
        },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_SERVICE_NOT_FOUND,
      );
    }

    // 2. Verifica se o MemberService está deletado
    if (memberServiceWithRelations.deletedAt) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_SERVICE_NOT_FOUND,
        {
          MEMBER_ID: memberId,
          ESTABLISHMENT_ID: establishmentId,
          SERVICE_ID: serviceId,
        },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_SERVICE_NOT_FOUND,
      );
    }

    // 3. Valida se o Establishment existe (dados já carregados do relacionamento)
    const establishment = memberServiceWithRelations.member.establishment;

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

    // 5. Valida se o Member existe no estabelecimento (dados já carregados)
    const member = memberServiceWithRelations.member;

    if (!member || member.establishmentId !== establishmentId) {
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

    return memberServiceWithRelations;
  }
}
