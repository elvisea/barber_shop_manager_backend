import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { EstablishmentMemberRepository } from '../../establishment-members/repositories/establishment-member.repository';
import { MemberServiceCreateRequestDTO } from '../dtos/member-service-create-request.dto';
import { MemberServiceCreateResponseDTO } from '../dtos/member-service-create-response.dto';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentServiceRepository } from '@/modules/establishment-services/repositories/establishment-service.repository';
import { EstablishmentAccessService } from '@/shared/establishment-access/establishment-access.service';

@Injectable()
export class MemberServiceCreateService {
  private readonly logger = new Logger(MemberServiceCreateService.name);

  constructor(
    private readonly memberServiceRepository: MemberServiceRepository,
    private readonly establishmentMemberRepository: EstablishmentMemberRepository,
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentAccessService: EstablishmentAccessService,
  ) {}

  async execute(
    dto: MemberServiceCreateRequestDTO,
    establishmentId: string,
    memberId: string,
    requesterId: string,
  ): Promise<MemberServiceCreateResponseDTO> {
    this.logger.log(
      `Creating member service for member ${memberId} in establishment ${establishmentId} and service ${dto.serviceId}`,
    );

    // 1. Verifica se o requester tem acesso ao estabelecimento
    await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      requesterId,
    );

    // 2. Verifica se o membro existe no estabelecimento
    const memberExists =
      await this.establishmentMemberRepository.existsByUserAndEstablishment(
        memberId,
        establishmentId,
      );

    if (!memberExists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND,
        { USER_ID: memberId, ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_MEMBER_NOT_FOUND,
      );
    }

    // 3. Verifica se o serviço existe no estabelecimento
    const service =
      await this.establishmentServiceRepository.findByIdAndEstablishment(
        dto.serviceId,
        establishmentId,
      );

    if (!service) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND,
        { SERVICE_ID: dto.serviceId, ESTABLISHMENT_ID: establishmentId },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND,
      );
    }

    // 4. Verifica se já existe associação desse serviço para o membro
    const alreadyExists =
      await this.memberServiceRepository.existsByUserEstablishmentService(
        memberId,
        establishmentId,
        dto.serviceId,
      );
    if (alreadyExists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_SERVICE_ALREADY_EXISTS,
        {
          USER_ID: memberId,
          ESTABLISHMENT_ID: establishmentId,
          SERVICE_ID: dto.serviceId,
        },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.CONFLICT,
        ErrorCode.MEMBER_SERVICE_ALREADY_EXISTS,
      );
    }

    // 5. Cria o MemberService
    const memberService =
      await this.memberServiceRepository.createMemberService({
        userId: memberId,
        establishmentId,
        serviceId: dto.serviceId,
        price: dto.price,
        commission: dto.commission,
        duration: dto.duration,
      });

    this.logger.log(`MemberService created with ID: ${memberService.id}`);

    return {
      id: memberService.id,
      userId: memberService.userId,
      establishmentId: memberService.establishmentId,
      serviceId: memberService.serviceId,
      price: memberService.price,
      commission: Number(memberService.commission),
      createdAt: memberService.createdAt,
      updatedAt: memberService.updatedAt,
    };
  }
}
