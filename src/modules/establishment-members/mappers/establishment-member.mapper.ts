import { EstablishmentMember, User } from '@prisma/client';

import { EstablishmentMemberFindByIdResponseDTO } from '../dtos/establishment-member-find-by-id-response.dto';

export class EstablishmentMemberMapper {
  static toFindByIdResponse(
    member: EstablishmentMember & { user: User },
  ): EstablishmentMemberFindByIdResponseDTO {
    return {
      user: {
        id: member.user.id,
        name: member.user.name,
        email: member.user.email,
        phone: member.user.phone,
        emailVerified: member.user.emailVerified,
        createdAt: member.user.createdAt,
        updatedAt: member.user.updatedAt,
      },
      member: {
        role: member.role,
        isActive: member.isActive,
        createdAt: member.createdAt,
        updatedAt: member.updatedAt,
      },
    };
  }
}
