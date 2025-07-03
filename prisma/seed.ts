import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Iniciando o seed do banco de dados...');

  // Limpar dados existentes (opcional - cuidado em produção!)
  await prisma.appointmentService.deleteMany({});
  await prisma.appointment.deleteMany({});
  await prisma.service.deleteMany({});
  await prisma.barber.deleteMany({});
  await prisma.client.deleteMany({});

  // Criar serviços
  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: 'Corte Masculino',
        description: 'Corte de cabelo masculino tradicional',
        price: 30.00,
        duration: 30,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Barba',
        description: 'Aparar e modelar barba',
        price: 20.00,
        duration: 20,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Corte + Barba',
        description: 'Pacote completo: corte de cabelo e barba',
        price: 45.00,
        duration: 45,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Sobrancelha',
        description: 'Aparar e modelar sobrancelhas',
        price: 15.00,
        duration: 15,
      },
    }),
    prisma.service.create({
      data: {
        name: 'Lavagem',
        description: 'Lavagem e hidratação capilar',
        price: 25.00,
        duration: 25,
      },
    }),
  ]);

  console.log(`✅ Criados ${services.length} serviços`);

  // Criar barbeiros
  const barbers = await Promise.all([
    prisma.barber.create({
      data: {
        name: 'João Silva',
        email: 'joao@barbershop.com',
        phone: '(11) 99999-1111',
        specialty: 'Cortes clássicos e barbas',
      },
    }),
    prisma.barber.create({
      data: {
        name: 'Pedro Santos',
        email: 'pedro@barbershop.com',
        phone: '(11) 99999-2222',
        specialty: 'Cortes modernos e degradês',
      },
    }),
    prisma.barber.create({
      data: {
        name: 'Carlos Oliveira',
        email: 'carlos@barbershop.com',
        phone: '(11) 99999-3333',
        specialty: 'Especialista em barbas',
      },
    }),
  ]);

  console.log(`✅ Criados ${barbers.length} barbeiros`);

  // Criar clientes
  const clients = await Promise.all([
    prisma.client.create({
      data: {
        name: 'Roberto Ferreira',
        email: 'roberto@email.com',
        phone: '(11) 98888-1111',
      },
    }),
    prisma.client.create({
      data: {
        name: 'Marcos Costa',
        email: 'marcos@email.com',
        phone: '(11) 98888-2222',
      },
    }),
    prisma.client.create({
      data: {
        name: 'Felipe Lima',
        email: 'felipe@email.com',
        phone: '(11) 98888-3333',
      },
    }),
    prisma.client.create({
      data: {
        name: 'Ricardo Alves',
        email: 'ricardo@email.com',
        phone: '(11) 98888-4444',
      },
    }),
    prisma.client.create({
      data: {
        name: 'Anderson Moura',
        email: 'anderson@email.com',
        phone: '(11) 98888-5555',
      },
    }),
  ]);

  console.log(`✅ Criados ${clients.length} clientes`);

  // Criar alguns agendamentos
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  tomorrow.setHours(10, 0, 0, 0);

  const appointments = await Promise.all([
    prisma.appointment.create({
      data: {
        client_id: clients[0].id,
        barber_id: barbers[0].id,
        date_time: tomorrow,
        status: 'SCHEDULED',
        total_price: 30.00,
        notes: 'Cliente prefere corte mais curto',
      },
    }),
    prisma.appointment.create({
      data: {
        client_id: clients[1].id,
        barber_id: barbers[1].id,
        date_time: new Date(tomorrow.getTime() + 60 * 60 * 1000), // +1 hora
        status: 'CONFIRMED',
        total_price: 45.00,
        notes: 'Corte + barba',
      },
    }),
    prisma.appointment.create({
      data: {
        client_id: clients[2].id,
        barber_id: barbers[2].id,
        date_time: new Date(tomorrow.getTime() + 2 * 60 * 60 * 1000), // +2 horas
        status: 'SCHEDULED',
        total_price: 20.00,
        notes: 'Apenas barba',
      },
    }),
  ]);

  console.log(`✅ Criados ${appointments.length} agendamentos`);

  // Associar serviços aos agendamentos
  await Promise.all([
    // Primeiro agendamento - apenas corte
    prisma.appointmentService.create({
      data: {
        appointment_id: appointments[0].id,
        service_id: services[0].id, // Corte Masculino
      },
    }),
    // Segundo agendamento - corte + barba
    prisma.appointmentService.create({
      data: {
        appointment_id: appointments[1].id,
        service_id: services[2].id, // Corte + Barba
      },
    }),
    // Terceiro agendamento - apenas barba
    prisma.appointmentService.create({
      data: {
        appointment_id: appointments[2].id,
        service_id: services[1].id, // Barba
      },
    }),
  ]);

  console.log('✅ Serviços associados aos agendamentos');
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