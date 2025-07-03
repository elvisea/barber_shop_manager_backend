import { PrismaClient, Role } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o seed do banco de dados...');

  // 1. Limpar dados existentes em uma ordem que respeite as constraints
  console.log('🧹 Limpando dados antigos...');
  await prisma.transactionItem.deleteMany({});
  await prisma.transaction.deleteMany({});
  await prisma.paymentOrder.deleteMany({});
  await prisma.appointmentService.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.establishmentCustomer.deleteMany({});
  await prisma.memberProduct.deleteMany({});
  await prisma.memberService.deleteMany({});
  await prisma.establishmentProduct.deleteMany({});
  await prisma.establishmentService.deleteMany({});
  await prisma.establishmentMember.deleteMany({});
  await prisma.establishment.deleteMany({});
  await prisma.user.deleteMany({});

  // 2. Criar Usuários
  console.log('👤 Criando usuários...');
  // Lembre-se de usar uma lib como bcryptjs em produção para gerar o hash da senha
  const plainPassword = 'password123';

  const adminUser = await prisma.user.create({
    data: {
      name: 'Admin da Barbearia',
      email: 'admin@barbershop.com',
      phone: '(11) 98888-0001',
      password: plainPassword,
      emailVerified: true,
    },
  });

  const barberUser = await prisma.user.create({
    data: {
      name: 'Roberto Carlos',
      email: 'roberto.carlos@barbershop.com',
      phone: '(11) 98888-0002',
      password: plainPassword,
      emailVerified: true,
    },
  });

  console.log('✅ Usuários criados:', { adminUser, barberUser });

  // 3. Criar um Estabelecimento
  console.log('🏢 Criando estabelecimento...');
  const establishment = await prisma.establishment.create({
    data: {
      name: 'Barbearia Clássica',
      address: 'Rua das Tesouras, 123, São Paulo, SP',
      phone: '(11) 5555-1234',
    },
  });
  console.log('✅ Estabelecimento criado:', establishment);

  // 4. Associar usuários ao estabelecimento (criar membros)
  console.log('🤝 Associando membros ao estabelecimento...');
  const adminMember = await prisma.establishmentMember.create({
    data: {
      userId: adminUser.id,
      establishmentId: establishment.id,
      role: Role.ADMIN,
    },
  });

  const barberMember = await prisma.establishmentMember.create({
    data: {
      userId: barberUser.id,
      establishmentId: establishment.id,
      role: Role.BARBER,
    },
  });
  console.log('✅ Membros criados:', { adminMember, barberMember });

  // 5. Adicionar Serviços ao Estabelecimento
  console.log('✂️ Adicionando serviços...');
  await prisma.establishmentService.createMany({
    data: [
      {
        name: 'Corte de Cabelo',
        description: 'Corte moderno com tesoura e máquina.',
        duration: 30, // minutos
        price: 5000, // R$ 50,00 em centavos
        commission: 0.4, // 40%
        establishmentId: establishment.id,
      },
      {
        name: 'Barba Tradicional',
        description: 'Barba feita com navalha e toalha quente.',
        duration: 25,
        price: 3500, // R$ 35,00 em centavos
        commission: 0.4,
        establishmentId: establishment.id,
      },
    ],
  });
  console.log('✅ Serviços adicionados.');

  // 6. Adicionar Produtos ao Estabelecimento
  console.log('🧴 Adicionando produtos...');
  await prisma.establishmentProduct.createMany({
    data: [
      {
        name: 'Cera Modeladora Efeito Matte',
        description: 'Alta fixação e sem brilho.',
        stock: 50,
        price: 4500, // R$ 45,00 em centavos
        commission: 0.1, // 10%
        establishmentId: establishment.id,
      },
      {
        name: 'Óleo para Barba',
        description: 'Hidrata e dá brilho aos fios.',
        stock: 30,
        price: 3000, // R$ 30,00 em centavos
        commission: 0.1,
        establishmentId: establishment.id,
      },
    ],
  });
  console.log('✅ Produtos adicionados.');

  // 7. Adicionar um Cliente ao Estabelecimento
  console.log('👨‍🦱 Adicionando um cliente...');
  const customer = await prisma.establishmentCustomer.create({
    data: {
      name: 'Cliente Fiel da Silva',
      email: 'cliente.fiel@email.com',
      phone: '(11) 97777-7777',
      establishmentId: establishment.id,
    },
  });
  console.log('✅ Cliente adicionado:', customer);

  console.log('🎉 Seed concluído com sucesso!');
}

main()
  .catch((e) => {
    console.error('❌ Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 