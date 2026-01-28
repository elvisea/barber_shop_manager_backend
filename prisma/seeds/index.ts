import { PrismaClient, TokenType, UserRole } from '@prisma/client';
import { PasswordHasher } from './utils/hash-password';
import { CustomerSeedData } from './data/customers';
import { EstablishmentSeedData } from './data/establishments';
import { MemberSeedData } from './data/members';
import { createBarberCustomizations } from './data/member-customizations';
import { ProductSeedData } from './data/products';
import { ServiceSeedData } from './data/services';
import { UserSeedData } from './data/users';
import { SeedValidation } from './utils/validation';

const prisma = new PrismaClient();

/**
 * Script principal de seed para popular o banco de dados.
 * Requer SEED_PASSWORD e ENCRYPTION_KEY no ambiente.
 */
async function main() {
  console.log('🌱 Iniciando processo de seed...');

  const seedPassword = process.env.SEED_PASSWORD;
  if (!seedPassword || seedPassword.trim() === '') {
    console.error('❌ SEED_PASSWORD não definida.');
    console.error('   Defina SEED_PASSWORD no .env para executar o seed.');
    throw new Error('SEED_PASSWORD environment variable is required for seeds');
  }

  try {
    if (!(await SeedValidation.isDatabaseConnected())) {
      throw new Error('Não foi possível conectar com o banco de dados');
    }

    if (await SeedValidation.hasExistingData()) {
      console.log('⚠️  Dados já existem no banco. Limpando...');
      await SeedValidation.clearDatabase();
    }

    const hashedPassword = await PasswordHasher.hashPassword(seedPassword);
    const usedPhones = new Set<string>();

    console.log('👥 Criando usuários (1 root + 2 owners)...');
    const usersData = await UserSeedData.generateUsers(hashedPassword);
    const users = await Promise.all(
      usersData.map(userData => prisma.user.create({ data: userData })),
    );
    console.log(`✅ ${users.length} usuários criados`);

    console.log('📧 Criando tokens de verificação de email para usuários...');
    const userEmailVerificationsData = await UserSeedData.generateUserEmailVerifications(users);
    await Promise.all(
      userEmailVerificationsData.map(verificationData =>
        prisma.token.create({
          data: {
            userId: verificationData.userId,
            type: TokenType.EMAIL_VERIFICATION,
            token: verificationData.token,
            expiresAt: verificationData.expiresAt,
            used: verificationData.verified,
          },
        }),
      ),
    );
    console.log(`✅ ${userEmailVerificationsData.length} tokens de verificação de email criados`);

    const owners = users.filter(u => u.role === UserRole.OWNER);
    console.log('🏢 Criando estabelecimentos (2 por owner)...');
    const establishmentsData = EstablishmentSeedData.generateAllEstablishments(owners, usedPhones);
    const establishments = await Promise.all(
      establishmentsData.map(establishmentData =>
        prisma.establishment.create({ data: establishmentData }),
      ),
    );
    console.log(`✅ ${establishments.length} estabelecimentos criados`);

    console.log('👨‍💼 Criando membros (6 por estabelecimento: 2 RECEPTIONIST, 2 HAIRDRESSER, 2 BARBER)...');
    const membersData = MemberSeedData.generateAllMembers(
      establishments,
      hashedPassword,
      usedPhones,
    );
    const barbers: Array<{ userId: string; establishmentId: string }> = [];

    for (const member of membersData) {
      const createdUser = await prisma.user.create({ data: member.user });
      await prisma.userEstablishment.create({
        data: {
          userId: createdUser.id,
          establishmentId: member.establishmentId,
          role: member.role,
          isActive: true,
        },
      });
      if (member.role === UserRole.BARBER) {
        barbers.push({ userId: createdUser.id, establishmentId: member.establishmentId });
      }
    }
    console.log(`✅ ${membersData.length} membros criados (${barbers.length} barbeiros)`);

    console.log('🛍️ Criando serviços (15 por estabelecimento)...');
    const servicesData = ServiceSeedData.generateAllServices(establishments);
    await Promise.all(
      servicesData.map(serviceData =>
        prisma.establishmentService.create({ data: serviceData }),
      ),
    );
    console.log(`✅ ${servicesData.length} serviços criados`);

    console.log('📦 Criando produtos (15 por estabelecimento)...');
    const productsData = ProductSeedData.generateAllProducts(establishments);
    await Promise.all(
      productsData.map(productData =>
        prisma.establishmentProduct.create({ data: productData }),
      ),
    );
    console.log(`✅ ${productsData.length} produtos criados`);

    console.log('👤 Criando clientes (15 por estabelecimento)...');
    const customersData = CustomerSeedData.generateAllCustomers(establishments, usedPhones);
    await Promise.all(
      customersData.map(customerData =>
        prisma.establishmentCustomer.create({ data: customerData }),
      ),
    );
    console.log(`✅ ${customersData.length} clientes criados`);

    console.log('🔗 Criando customizações (UserService + UserProduct) para barbeiros...');
    const { userServicesCount, userProductsCount } = await createBarberCustomizations(
      prisma,
      barbers,
    );
    console.log(`✅ ${userServicesCount} UserService e ${userProductsCount} UserProduct criados`);

    console.log('\n🎉 Seed concluído com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`- ${users.length} usuários (root + owners)`);
    console.log(`- ${establishments.length} estabelecimentos`);
    console.log(`- ${membersData.length} membros (funcionários)`);
    console.log(`- ${servicesData.length} serviços`);
    console.log(`- ${productsData.length} produtos`);
    console.log(`- ${customersData.length} clientes`);
    console.log(`- ${userServicesCount} customizações de serviço (barbeiros)`);
    console.log(`- ${userProductsCount} customizações de produto (barbeiros)`);
    console.log('\n📝 Credenciais (senha = SEED_PASSWORD do .env):');
    users.forEach(u => {
      console.log(`   - ${u.email} (${u.role})`);
    });
  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

if (require.main === module) {
  main()
    .catch((error) => {
      console.error('❌ Falha no seed:', error);
      process.exit(1);
    });
}

export { main as seedDatabase };
