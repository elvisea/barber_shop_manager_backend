import { Injectable, Logger } from '@nestjs/common';

import { MemberWithServicesResponseDTO } from '../dtos/member-with-services-response.dto';
import { MemberWithServicesMapper } from '../mappers/member-with-services.mapper';
import { MemberRepository } from '../repositories/member.repository';

import { EstablishmentAccessService } from '@/shared/establishment-access/services/establishment-access.service';

@Injectable()
export class MemberListWithServicesService {
  private readonly logger = new Logger(MemberListWithServicesService.name);

  constructor(
    private readonly memberRepository: MemberRepository,
    private readonly establishmentAccessService: EstablishmentAccessService,
  ) {}

  async execute(
    establishmentId: string,
    requesterId: string,
  ): Promise<MemberWithServicesResponseDTO[]> {
    this.logger.log(
      `Listing members with services for establishment ${establishmentId} by user ${requesterId}`,
    );

    // 1. Valida acesso (qualquer membro do estabelecimento pode ver a lista para agendar)
    await this.establishmentAccessService.assertUserCanAccessEstablishment(
      requesterId,
      establishmentId,
    );

    // 2. Busca dados otimizados no repositório
    const members =
      await this.memberRepository.findAllWithServicesByEstablishment(
        establishmentId,
      );

    // 3. Mapeia para DTO usando Mapper
    return members.map((member) => MemberWithServicesMapper.toDTO(member));
  }
}
