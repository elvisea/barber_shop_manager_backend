import { PrismaClient, TokenType } from '@prisma/client';
import { CustomerSeedData } from './data/customers';
import { EstablishmentSeedData } from './data/establishments';
import { MemberSeedData } from './data/members';
import { ProductSeedData } from './data/products';
import { ServiceSeedData } from './data/services';
import { UserSeedData } from './data/users';
import { SeedValidation } from './utils/validation';

const prisma = new PrismaClient();

/**
 * Script principal de seed para popular o banco de dados
 */
async function main() {
  console.log('🌱 Iniciando processo de seed...');

  try {
    // Verificar conexão com banco
    if (!(await SeedValidation.isDatabaseConnected())) {
      throw new Error('Não foi possível conectar com o banco de dados');
    }

    // Verificar se já existem dados
    if (await SeedValidation.hasExistingData()) {
      console.log('⚠️  Dados já existem no banco. Deseja limpar? (y/N)');
      // Para automação, vamos limpar automaticamente
      await SeedValidation.clearDatabase();
    }

    console.log('👥 Criando usuários...');
    const usersData = await UserSeedData.generateUsers();
    const users = await Promise.all(
      usersData.map(userData => prisma.user.create({ data: userData }))
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
        })
      )
    );
    console.log(`✅ ${userEmailVerificationsData.length} tokens de verificação de email de usuários criados`);

    console.log('🏢 Criando estabelecimentos...');
    const establishmentsData = EstablishmentSeedData.generateAllEstablishments(users);
    const establishments = await Promise.all(
      establishmentsData.map(establishmentData =>
        prisma.establishment.create({ data: establishmentData })
      )
    );
    console.log(`✅ ${establishments.length} estabelecimentos criados`);

    // TODO: Implementar criação de UserEstablishments quando necessário
    // console.log('👨‍💼 Criando membros...');
    // const membersData = await MemberSeedData.generateAllMembers(establishments);
    // const members = await Promise.all(
    //   membersData.map(memberData => prisma.member.create({ data: memberData }))
    // );
    // console.log(`✅ ${members.length} membros criados`);

    // console.log('📧 Criando tokens de verificação de email para membros...');
    // const memberEmailVerificationsData = await MemberSeedData.generateMemberEmailVerifications(members);
    // await Promise.all(
    //   memberEmailVerificationsData.map(verificationData =>
    //     prisma.token.create({
    //       data: {
    //         userId: verificationData.memberId,
    //         type: TokenType.EMAIL_VERIFICATION,
    //         token: verificationData.token,
    //         expiresAt: verificationData.expiresAt,
    //         used: verificationData.verified,
    //       },
    //     })
    //   )
    // );
    // console.log(`✅ ${memberEmailVerificationsData.length} tokens de verificação de email de membros criados`);
    const members: Array<{ id: string }> = [];
    const memberEmailVerificationsData: Array<unknown> = [];

    console.log('🛍️ Criando serviços...');
    const servicesData = ServiceSeedData.generateAllServices(establishments);
    const services = await Promise.all(
      servicesData.map(serviceData =>
        prisma.establishmentService.create({ data: serviceData })
      )
    );
    console.log(`✅ ${services.length} serviços criados`);

    console.log('📦 Criando produtos...');
    const productsData = ProductSeedData.generateAllProducts(establishments);
    const products = await Promise.all(
      productsData.map(productData =>
        prisma.establishmentProduct.create({ data: productData })
      )
    );
    console.log(`✅ ${products.length} produtos criados`);

    console.log('👤 Criando clientes...');
    const customersData = CustomerSeedData.generateAllCustomers(establishments);
    const customers = await Promise.all(
      customersData.map(customerData =>
        prisma.establishmentCustomer.create({ data: customerData })
      )
    );
    console.log(`✅ ${customers.length} clientes criados`);

    // TODO: Implementar criação de UserServices e UserProducts quando necessário
    // console.log('🔗 Criando associações membro-serviço...');
    const memberServices: Array<unknown> = [];
    // await Promise.all(
    //   memberServices.map(ms => prisma.userService.create({ data: ms }))
    // );
    // console.log(`✅ ${memberServices.length} associações membro-serviço criadas`);

    // console.log('🔗 Criando associações membro-produto...');
    const memberProducts: Array<unknown> = [];
    // await Promise.all(
    //   memberProducts.map(mp => prisma.userProduct.create({ data: mp }))
    // );
    // console.log(`✅ ${memberProducts.length} associações membro-produto criadas`);

    console.log('🎉 Seed concluído com sucesso!');
    console.log('\n📊 Resumo:');
    console.log(`- ${users.length} usuários`);
    console.log(`- ${userEmailVerificationsData.length} tokens de verificação de email de usuários`);
    console.log(`- ${establishments.length} estabelecimentos`);
    console.log(`- ${members.length} membros`);
    console.log(`- ${memberEmailVerificationsData.length} tokens de verificação de email de membros`);
    console.log(`- ${services.length} serviços`);
    console.log(`- ${products.length} produtos`);
    console.log(`- ${customers.length} clientes`);
    console.log(`- ${memberServices.length} associações membro-serviço`);
    console.log(`- ${memberProducts.length} associações membro-produto`);

  } catch (error) {
    console.error('❌ Erro durante o seed:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Executar se chamado diretamente
if (require.main === module) {
  main()
    .catch((error) => {
      console.error('❌ Falha no seed:', error);
      process.exit(1);
    });
}

export { main as seedDatabase };
