import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Utilitários de validação para seeds
 */
export class SeedValidation {
  /**
   * Verifica se já existem dados no banco
   */
  static async hasExistingData(): Promise<boolean> {
    const userCount = await prisma.user.count();
    const establishmentCount = await prisma.establishment.count();

    return userCount > 0 || establishmentCount > 0;
  }

  /**
   * Limpa todos os dados do banco (CUIDADO!)
   */
  static async clearDatabase(): Promise<void> {
    console.log('🧹 Limpando banco de dados...');

    // Ordem de deleção respeitando foreign keys
    await prisma.paymentOrder.deleteMany();
    await prisma.transactionItem.deleteMany();
    await prisma.transaction.deleteMany();
    await prisma.appointmentService.deleteMany();
    await prisma.appointment.deleteMany();
    await prisma.memberService.deleteMany();
    await prisma.memberProduct.deleteMany();
    await prisma.memberWorkingHours.deleteMany();
    await prisma.memberAbsencePeriod.deleteMany();
    await prisma.member.deleteMany();
    await prisma.establishmentCustomer.deleteMany();
    await prisma.establishmentService.deleteMany();
    await prisma.establishmentProduct.deleteMany();
    await prisma.closurePeriod.deleteMany();
    await prisma.subscription.deleteMany();
    await prisma.establishment.deleteMany();
    await prisma.userEmailVerification.deleteMany();
    await prisma.refreshToken.deleteMany();
    await prisma.user.deleteMany();

    console.log('✅ Banco de dados limpo');
  }

  /**
   * Verifica se o banco está conectado
   */
  static async isDatabaseConnected(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('❌ Erro ao conectar com o banco de dados:', error);
      return false;
    }
  }
}
