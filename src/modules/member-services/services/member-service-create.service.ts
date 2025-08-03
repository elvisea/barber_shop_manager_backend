import { HttpStatus, Injectable, Logger } from '@nestjs/common';

import { MemberServiceCreateParamDTO } from '../dtos/member-service-create-param.dto';
import { MemberServiceCreateRequestDTO } from '../dtos/member-service-create-request.dto';
import { MemberServiceCreateResponseDTO } from '../dtos/member-service-create-response.dto';
import { MemberServiceRepository } from '../repositories/member-service.repository';

import { CustomHttpException } from '@/common/exceptions/custom-http-exception';
import { ErrorCode } from '@/enums/error-code';
import { ErrorMessageService } from '@/error-message/error-message.service';
import { EstablishmentServiceRepository } from '@/modules/establishment-services/repositories/establishment-service.repository';
import { MemberRepository } from '@/modules/members/repositories/member.repository';
import { EstablishmentOwnerAccessService } from '@/shared/establishment-owner-access/establishment-owner-access.service';

@Injectable()
export class MemberServiceCreateService {
  private readonly logger = new Logger(MemberServiceCreateService.name);

  constructor(
    private readonly memberServiceRepository: MemberServiceRepository,
    private readonly memberRepository: MemberRepository,
    private readonly establishmentServiceRepository: EstablishmentServiceRepository,
    private readonly errorMessageService: ErrorMessageService,
    private readonly establishmentOwnerAccessService: EstablishmentOwnerAccessService,
  ) {}

  async execute(
    dto: MemberServiceCreateRequestDTO,
    params: MemberServiceCreateParamDTO,
    requesterId: string,
  ): Promise<MemberServiceCreateResponseDTO> {
    this.logger.log(
      `Creating member service for member ${params.memberId} in establishment ${params.establishmentId} and service ${params.serviceId}`,
    );

    // 1. Verifica se o requester é dono do estabelecimento
    await this.establishmentOwnerAccessService.assertOwnerHasAccess(
      params.establishmentId,
      requesterId,
    );

    // 2. Verifica se o membro existe no estabelecimento
    const member = await this.memberRepository.findByEstablishmentAndId(
      params.establishmentId,
      params.memberId,
    );

    if (!member) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_NOT_FOUND,
        {
          MEMBER_ID: params.memberId,
          ESTABLISHMENT_ID: params.establishmentId,
        },
      );

      this.logger.warn(message);

      throw new CustomHttpException(
        message,
        HttpStatus.NOT_FOUND,
        ErrorCode.MEMBER_NOT_FOUND,
      );
    }

    // 3. Verifica se o serviço existe no estabelecimento
    const service =
      await this.establishmentServiceRepository.findByIdAndEstablishment(
        params.serviceId,
        params.establishmentId,
      );

    if (!service) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.ESTABLISHMENT_SERVICE_NOT_FOUND,
        {
          SERVICE_ID: params.serviceId,
          ESTABLISHMENT_ID: params.establishmentId,
        },
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
      await this.memberServiceRepository.existsByMemberEstablishmentService(
        params.memberId,
        params.establishmentId,
        params.serviceId,
      );
    if (alreadyExists) {
      const message = this.errorMessageService.getMessage(
        ErrorCode.MEMBER_SERVICE_ALREADY_EXISTS,
        {
          MEMBER_ID: params.memberId,
          ESTABLISHMENT_ID: params.establishmentId,
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

    // 5. Cria o MemberService
    const memberService =
      await this.memberServiceRepository.createMemberService({
        memberId: params.memberId,
        establishmentId: params.establishmentId,
        serviceId: params.serviceId,
        price: dto.price,
        commission: dto.commission,
        duration: dto.duration,
      });

    this.logger.log(`MemberService created with ID: ${memberService.id}`);

    return {
      id: memberService.id,
      memberId: memberService.memberId,
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
