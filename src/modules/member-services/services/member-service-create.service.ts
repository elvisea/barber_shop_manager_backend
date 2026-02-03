import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberServiceCreateParamDTO } from '../dtos/member-service-create-param.dto';
import { MemberServiceCreateRequestDTO } from '../dtos/member-service-create-request.dto';
import { MemberServiceCreateResponseDTO } from '../dtos/member-service-create-response.dto';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentServiceRepository } from '@/modules/establishment-services/repositories/establishment-service.repository';
import { UserEstablishmentValidationService } from '@/modules/user-establishments/services/user-establishment-validation.service';

/**
 * Associa um serviço do estabelecimento a um membro, definindo preço, duração e comissão para esse membro.
 * Apenas o dono do estabelecimento pode criar essa associação. Se existir registro soft-deleted
 * para a mesma tripla membro/serviço/estabelecimento, ele é restaurado em vez de criar um novo.
 * Resolve a necessidade de atribuir serviços à equipe com preço, duração e comissão customizados por membro.
 */
@Injectable()
export class MemberServiceCreateService {
  private readonly logger = new Logger(MemberServiceCreateService.name);

  constructor(
    private readonly memberServiceRepository: MemberServiceRepository,
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly userEstablishmentValidationService: UserEstablishmentValidationService,
  ) {}

  /**
   * Cria ou restaura uma associação member-service.
   *
   * @param dto - Preço, duração e comissão do member-service
   * @param params - Parâmetros da rota (memberId, serviceId)
   * @param requesterId - ID do usuário que faz a requisição (deve ser dono do estabelecimento)
   * @returns O member-service criado ou restaurado como {@link MemberServiceCreateResponseDTO}
   * @throws CustomHttpException NOT_FOUND quando o serviço não existe ou a validação dono/membro falha
   * @throws CustomHttpException CONFLICT quando já existe uma associação ativa
   */
  async execute(
    dto: MemberServiceCreateRequestDTO,
    params: MemberServiceCreateParamDTO,
    requesterId: string,
  ): Promise<MemberServiceCreateResponseDTO> {
    // 1. Busca o serviço do estabelecimento
    const service =
      await this.establishmentServiceRepository.findByIdWithEstablishment(
        params.serviceId,
      );

    if (!service) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND,
        { SERVICE_ID: params.serviceId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND,
      );
    }

    // 2. Obtém establishmentId do serviço
    const establishmentId = service.establishmentId;

    // 3. Valida que o requester é dono do estabelecimento e que o member pertence a ele (apenas dono pode atribuir)
    await this.userEstablishmentValidationService.validateUserAndEstablishment(
      params.memberId,
      establishmentId,
      requesterId,
    );

    this.logger.log(
      `Creating member service for member ${params.memberId} in establishment ${establishmentId} and service ${params.serviceId}`,
    );

    // 4. Verifica se já existe associação ativa desse serviço para o membro
    const alreadyExists =
      await this.memberServiceRepository.existsByMemberEstablishmentService(
        params.memberId,
        establishmentId,
        params.serviceId,
      );

    if (alreadyExists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_SERVICE_ALREADY_EXISTS,
        {
          MEMBER_ID: params.memberId,
          ESTABLISHMENT_ID: establishmentId,
          SERVICE_ID: params.serviceId,
        },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.CONFLICT,
        ErrorCode.MEMBER_SERVICE_ALREADY_EXISTS,
      );
    }

    // 5. Verifica se existir registro soft-deleted com a mesma tripla (para restaurar em vez de criar)
    const softDeleted =
      await this.memberServiceRepository.findOneByMemberEstablishmentServiceIncludingDeleted(
        params.memberId,
        establishmentId,
        params.serviceId,
      );

    // 6. Cria o MemberService ou restaura o registro soft-deleted
    const memberService = softDeleted?.deletedAt
      ? await this.memberServiceRepository.restoreMemberService(
          softDeleted.id,
          {
            price: dto.price,
            commission: dto.commission,
            duration: dto.duration,
          },
        )
      : await this.memberServiceRepository.createMemberService({
          memberId: params.memberId,
          establishmentId,
          serviceId: params.serviceId,
          price: dto.price,
          commission: dto.commission,
          duration: dto.duration,
        });

    this.logger.log(
      `MemberService ${softDeleted?.deletedAt ? 'restored' : 'created'} with ID: ${memberService.id}`,
    );

    // 7. Retorna o DTO de resposta
    return {
      id: memberService.id,
      memberId: memberService.userId,
      establishmentId: memberService.establishmentId,
      serviceId: memberService.serviceId,
      price: memberService.price,
      duration: memberService.duration,
      commission: Number(memberService.commission),
      createdAt: memberService.createdAt,
      updatedAt: memberService.updatedAt,
    };
  }
}
