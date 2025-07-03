import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o seed do banco de dados...');

  // Limpar dados existentes
  await prisma.user.deleteMany({});

  // Criar usuários com diferentes roles
  const users = await Promise.all([
    prisma.user.create({
      data: {
        name: 'João Silva',
        email: 'joao@barbershop.com',
        phone: '(11) 99999-1111',
        password: 'hashed_password_123', // Em produção, usar hash real
        role: 'BARBER',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Pedro Santos',
        email: 'pedro@barbershop.com',
        phone: '(11) 99999-2222',
        password: 'hashed_password_123',
        role: 'BARBER',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Maria Costa',
        email: 'maria@barbershop.com',
        phone: '(11) 99999-3333',
        password: 'hashed_password_123',
        role: 'HAIRDRESSER',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Ana Oliveira',
        email: 'ana@barbershop.com',
        phone: '(11) 99999-4444',
        password: 'hashed_password_123',
        role: 'RECEPTIONIST',
      },
    }),
    prisma.user.create({
      data: {
        name: 'Admin Sistema',
        email: 'admin@barbershop.com',
        phone: '(11) 99999-0000',
        password: 'hashed_password_123',
        role: 'ADMIN',
      },
    }),
  ]);

  console.log(`✅ Criados ${users.length} usuários`);
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