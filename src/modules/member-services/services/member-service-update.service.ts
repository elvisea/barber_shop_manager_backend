import { Injectable, Logger } from '@nestjs/common';

import { MemberServiceCreateResponseDTO } from '../dtos/member-service-create-response.dto';
import { MemberServiceUpdateParamDTO } from '../dtos/member-service-update-param.dto';
import { MemberServiceUpdateRequestDTO } from '../dtos/member-service-update-request.dto';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { MemberServiceValidationService } from './member-service-validation.service';

import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

/**
 * Atualiza preço, duração e comissão de um member-service existente. Apenas o dono do estabelecimento pode atualizar.
 * Resolve a necessidade de alterar preço, duração e comissão do serviço por membro sem remover a associação.
 */
@Injectable()
export class MemberServiceUpdateService {
  private readonly logger = new Logger(MemberServiceUpdateService.name);

  constructor(
    private readonly memberServiceRepository: MemberServiceRepository,
    private readonly memberServiceValidationService: MemberServiceValidationService,
    private readonly userEstablishmentValidationService: UserEstablishmentValidationService,
  ) {}

  /**
   * Atualiza o member-service com novo preço, duração e comissão.
   *
   * @param dto - Novo preço, duração e comissão
   * @param params - Parâmetros da rota (memberId, serviceId)
   * @param requesterId - ID do usuário que faz a requisição (deve ser dono do estabelecimento)
   * @returns Member-service atualizado como {@link MemberServiceCreateResponseDTO}
   * @throws CustomHttpException quando a validação falha (não encontrado, não é dono, etc.)
   */
  async execute(
    dto: MemberServiceUpdateRequestDTO,
    params: MemberServiceUpdateParamDTO,
    requesterId: string,
  ): Promise<MemberServiceCreateResponseDTO> {
    // 1. Obtém establishmentId (valida que o requester é dono e que o member pertence ao estabelecimento)
    const establishmentId =
      await this.userEstablishmentValidationService.getEstablishmentIdOwnedByRequesterForMember(
        params.memberId,
        requesterId,
      );

    this.logger.log(
      `Updating member service for member ${params.memberId} in establishment ${establishmentId} and service ${params.serviceId}`,
    );

    // 2. Valida e busca o MemberService existente com relacionamentos
    const memberServiceWithRelations =
      await this.memberServiceValidationService.execute(
        params.memberId,
        establishmentId,
        params.serviceId,
        requesterId,
      );

    // 3. Atualiza o MemberService
    const updatedMemberService =
      await this.memberServiceRepository.updateMemberService(
        memberServiceWithRelations.id,
        {
          price: dto.price,
          commission: dto.commission,
          duration: dto.duration,
        },
      );

    this.logger.log(
      `MemberService updated with ID: ${updatedMemberService.id}`,
    );

    // 4. Retorna o DTO de resposta
    return {
      id: updatedMemberService.id,
      memberId: updatedMemberService.userId,
      establishmentId: updatedMemberService.establishmentId,
      serviceId: updatedMemberService.serviceId,
      price: updatedMemberService.price,
      duration: updatedMemberService.duration,
      commission: Number(updatedMemberService.commission),
      createdAt: updatedMemberService.createdAt,
      updatedAt: updatedMemberService.updatedAt,
    };
  }
}
