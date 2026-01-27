import { Injectable, Logger } from '@nestjs/common';

import { MemberServiceFindOneParamDTO } from '../dtos/member-service-find-one-param.dto';
import { MemberServiceFindOneResponseDTO } from '../dtos/member-service-find-one-response.dto';

import { MemberServiceValidationService } from './member-service-validation.service';

/**
 * Service responsável por buscar um MemberService específico.
 */
@Injectable()
export class MemberServiceFindOneService {
  private readonly logger = new Logger(MemberServiceFindOneService.name);

  constructor(
    private readonly memberServiceValidationService: MemberServiceValidationService,
  ) {}

  /**
   * Busca um MemberService específico com todos os relacionamentos.
   *
   * @param params - Parâmetros da rota (memberId, establishmentId, serviceId)
   * @param requesterId - ID do usuário que está fazendo a requisição
   * @returns DTO com os dados do MemberService encontrado
   * @throws CustomHttpException se alguma validação falhar
   */
  async execute(
    params: MemberServiceFindOneParamDTO,
    requesterId: string,
  ): Promise<MemberServiceFindOneResponseDTO> {
    this.logger.log(
      `Finding member service for member ${params.memberId} in establishment ${params.establishmentId} and service ${params.serviceId}`,
    );

    // Validações centralizadas em uma única chamada
    const memberServiceWithRelations =
      await this.memberServiceValidationService.execute(
        params.memberId,
        params.establishmentId,
        params.serviceId,
        requesterId,
      );

    this.logger.log(`MemberService found: ${memberServiceWithRelations.id}`);

    return {
      id: memberServiceWithRelations.service.id, // Retorna serviceId para consistência com find-all
      name: memberServiceWithRelations.service.name,
      description: memberServiceWithRelations.service.description,
      duration: memberServiceWithRelations.duration,
      price: memberServiceWithRelations.price,
      commission: Number(memberServiceWithRelations.commission),
      createdAt: memberServiceWithRelations.createdAt,
      updatedAt: memberServiceWithRelations.updatedAt,
    };
  }
}
