import { MemberService } from '@prisma/client';

export interface IMemberServiceRepository {
  createMemberService(data: {
    userId: string;
    establishmentId: string;
    serviceId: string;
    price: number;
    commission: number;
    duration: number;
  }): Promise<MemberService>;

  findByUserEstablishmentService(
    userId: string,
    establishmentId: string,
    serviceId: string,
  ): Promise<MemberService | null>;

  existsByUserEstablishmentService(
    userId: string,
    establishmentId: string,
    serviceId: string,
  ): Promise<boolean>;
}
