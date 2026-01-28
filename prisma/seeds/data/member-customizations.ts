import { PrismaClient } from '@prisma/client';

/**
 * Cria UserService e UserProduct para cada usuário BARBER (customizações dos 15 serviços e 15 produtos do estabelecimento).
 */
export async function createBarberCustomizations(
  prisma: PrismaClient,
  barbers: Array<{ userId: string; establishmentId: string }>,
): Promise<{ userServicesCount: number; userProductsCount: number }> {
  let userServicesCount = 0;
  let userProductsCount = 0;

  for (const { userId, establishmentId } of barbers) {
    const services = await prisma.establishmentService.findMany({
      where: { establishmentId, deletedAt: null },
    });

    const products = await prisma.establishmentProduct.findMany({
      where: { establishmentId, deletedAt: null },
    });

    for (const svc of services) {
      await prisma.userService.create({
        data: {
          userId,
          establishmentId,
          serviceId: svc.id,
          price: svc.price,
          commission: svc.commission,
          duration: svc.duration,
        },
      });
      userServicesCount += 1;
    }

    for (const prod of products) {
      await prisma.userProduct.create({
        data: {
          userId,
          establishmentId,
          productId: prod.id,
          price: prod.price,
          commission: prod.commission,
        },
      });
      userProductsCount += 1;
    }
  }

  return { userServicesCount, userProductsCount };
}
