import { UserEstablishment, UserRole, Prisma } from '@prisma/client';

type UserEstablishmentWithRelations = Prisma.UserEstablishmentGetPayload<{
  include: { user: true; establishment: true };
}>;

export interface IUserEstablishmentRepository {
  create(data: {
    userId: string;
    establishmentId: string;
    role: UserRole;
  }): Promise<UserEstablishment>;

  findById(id: string): Promise<UserEstablishment | null>;

  findByUserAndEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<UserEstablishment | null>;

  findByUserAndEstablishmentWithRelations(
    userId: string,
    establishmentId: string,
  ): Promise<UserEstablishmentWithRelations | null>;

  findAllByUser(userId: string): Promise<UserEstablishment[]>;

  findAllByUserWithRelations(
    userId: string,
  ): Promise<UserEstablishmentWithRelations[]>;

  findAllByEstablishment(establishmentId: string): Promise<UserEstablishment[]>;

  update(
    id: string,
    data: Partial<{
      role: UserRole;
      isActive: boolean;
    }>,
  ): Promise<UserEstablishment>;

  delete(id: string, deletedByUserId?: string): Promise<void>;

  existsByUserAndEstablishment(
    userId: string,
    establishmentId: string,
  ): Promise<boolean>;

  findAllByEstablishmentPaginated({
    establishmentId,
    skip,
    take,
  }: {
    establishmentId: string;
    skip: number;
    take: number;
  }): Promise<{
    data: UserEstablishmentWithRelations[];
    total: number;
  }>;

  findByUserAndEstablishmentId(
    userId: string,
    establishmentId: string,
  ): Promise<UserEstablishmentWithRelations | null>;
}
