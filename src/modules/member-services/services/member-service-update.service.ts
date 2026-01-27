import { Injectable, Logger } from '@nestjs/common';

import { MemberServiceCreateResponseDTO } from '../dtos/member-service-create-response.dto';
import { MemberServiceUpdateParamDTO } from '../dtos/member-service-update-param.dto';
import { MemberServiceUpdateRequestDTO } from '../dtos/member-service-update-request.dto';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { MemberServiceValidationService } from './member-service-validation.service';

/**
 * Service responsável por atualizar um MemberService.
 */
@Injectable()
export class MemberServiceUpdateService {
  private readonly logger = new Logger(MemberServiceUpdateService.name);

  constructor(
    private readonly memberServiceRepository: MemberServiceRepository,
    private readonly memberServiceValidationService: MemberServiceValidationService,
  ) {}

  /**
   * Atualiza um MemberService existente.
   *
   * @param dto - Dados para atualização (price, commission, duration)
   * @param params - Parâmetros da rota (memberId, establishmentId, serviceId)
   * @param requesterId - ID do usuário que está fazendo a requisição
   * @returns DTO com os dados atualizados do MemberService
   * @throws CustomHttpException se alguma validação falhar
   */
  async execute(
    dto: MemberServiceUpdateRequestDTO,
    params: MemberServiceUpdateParamDTO,
    requesterId: string,
  ): Promise<MemberServiceCreateResponseDTO> {
    this.logger.log(
      `Updating member service for member ${params.memberId} in establishment ${params.establishmentId} and service ${params.serviceId}`,
    );

    // Validações centralizadas em uma única chamada
    const memberServiceWithRelations =
      await this.memberServiceValidationService.execute(
        params.memberId,
        params.establishmentId,
        params.serviceId,
        requesterId,
      );

    // Atualiza o MemberService
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

    return {
      id: updatedMemberService.id,
      memberId: updatedMemberService.memberId,
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
