import {
  EstablishmentProduct,
  MemberProduct as MemberProductModel,
} from '@prisma/client';

export class MemberProductMapper {
  static toFindAllResponse(
    memberProduct: MemberProductModel & { product: EstablishmentProduct },
  ) {
    return {
      id: memberProduct.product.id,
      name: memberProduct.product.name,
      description: memberProduct.product.description,
      createdAt: memberProduct.createdAt,
      updatedAt: memberProduct.updatedAt,
      price: memberProduct.price,
      commission: Number(memberProduct.commission),
    };
  }
}
