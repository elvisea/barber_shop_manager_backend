import { MemberProduct } from '@prisma/client';

export interface IMemberProductRepository {
  createMemberProduct(data: {
    userId: string;
    establishmentId: string;
    productId: string;
    price: number;
    commission: number;
  }): Promise<MemberProduct>;

  findByUserEstablishmentProduct(
    userId: string,
    establishmentId: string,
    productId: string,
  ): Promise<MemberProduct | null>;

  existsByUserEstablishmentProduct(
    userId: string,
    establishmentId: string,
    productId: string,
  ): Promise<boolean>;
}
