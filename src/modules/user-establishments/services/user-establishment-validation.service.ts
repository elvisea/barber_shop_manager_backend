import { Injectable } from '@nestjs/common';
import { Establishment, User } from '@prisma/client';

import { UserEstablishmentGetEstablishmentIdForMemberService } from './user-establishment-get-establishment-id-for-member.service';
import { UserEstablishmentValidateAccessService } from './user-establishment-validate-access.service';
import { UserEstablishmentValidateOwnerAndMemberService } from './user-establishment-validate-owner-and-member.service';

/**
 * Facade que expõe as validações de user-establishment.
 *
 * Delega para os serviços especializados:
 * - getEstablishmentIdOwnedByRequesterForMember → UserEstablishmentGetEstablishmentIdForMemberService
 * - validateUserAccessToEstablishment → UserEstablishmentValidateAccessService
 * - validateUserAndEstablishment → UserEstablishmentValidateOwnerAndMemberService
 */
@Injectable()
export class UserEstablishmentValidationService {
  constructor(
    private readonly getEstablishmentIdForMemberService: UserEstablishmentGetEstablishmentIdForMemberService,
    private readonly validateAccessService: UserEstablishmentValidateAccessService,
    private readonly validateOwnerAndMemberService: UserEstablishmentValidateOwnerAndMemberService,
  ) {}

  async getEstablishmentIdOwnedByRequesterForMember(
    memberId: string,
    requesterId: string,
  ): Promise<string> {
    return this.getEstablishmentIdForMemberService.execute(
      memberId,
      requesterId,
    );
  }

  async validateUserAccessToEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<void> {
    return this.validateAccessService.execute(userId, establishmentId);
  }

  async validateUserAndEstablishment(
    userId: string,
    establishmentId: string,
    requesterId: string,
  ): Promise<{ establishment: Establishment; member: User }> {
    return this.validateOwnerAndMemberService.execute(
      userId,
      establishmentId,
      requesterId,
    );
  }
}
