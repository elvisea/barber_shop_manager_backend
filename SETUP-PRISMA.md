# Setup Prisma ORM com PostgreSQL - Barber Shop Manager

Este documento detalha **passo a passo** como foi configurado o Prisma ORM com PostgreSQL no projeto NestJS seguindo a **documentação oficial** do NestJS.

## 📋 Pré-requisitos

- Node.js 18+ instalado
- PostgreSQL instalado e rodando (ou Docker)
- Docker e Docker Compose (opcional, mas recomendado)

## 🐳 Configuração do Banco de Dados (Docker)

### 1. PostgreSQL via Docker (Recomendado)

O projeto está configurado para usar PostgreSQL via Docker. O banco já está rodando na rede Docker com as seguintes configurações:

```yaml
# docker-compose.yml (se usar Docker)
version: '3.8'
services:
  postgres:
    image: postgres:15
    container_name: barber_shop_manager_db_container
    environment:
      POSTGRES_DB: barber_shop_manager_db_dev
      POSTGRES_USER: barber_shop_manager_db_dev_user
      POSTGRES_PASSWORD: barber_shop_manager_db_dev_password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - app-network

volumes:
  postgres_data:

networks:
  app-network:
    driver: bridge
```

### 2. Iniciar o Banco de Dados

```bash
# Se usar Docker Compose
docker-compose up -d postgres

# Ou se o banco já está rodando em Docker
docker ps | grep postgres
```

## 🛠️ Configuração do Projeto NestJS

### 1. Instalação das Dependências

```bash
# Dependências principais
npm install @prisma/client @nestjs/config

# Dependência de desenvolvimento
npm install -D prisma ts-node
```

**✅ Importante:** A biblioteca `nestjs-prisma` **NÃO é necessária**. A documentação oficial do NestJS mostra como integrar o Prisma diretamente.

### 2. Configuração das Variáveis de Ambiente

Configure o arquivo `.env` com as credenciais reais:

```env
# Configurações do Servidor
NODE_ENV=development
PORT=3333
LOG_LEVEL="debug"

# Configurações do Banco de Dados PostgreSQL
POSTGRES_PORT=5432
POSTGRES_DB=barber_shop_manager_db_dev
POSTGRES_USER=barber_shop_manager_db_dev_user
POSTGRES_PASSWORD=barber_shop_manager_db_dev_password

# URL de Conexão com o Banco de Dados (Docker Network)
DATABASE_URL=postgresql://barber_shop_manager_db_dev_user:barber_shop_manager_db_dev_password@172.17.0.1:5432/barber_shop_manager_db_dev?schema=public

# Configurações de Containers Docker
CONTAINER_NAME_APP=barber_shop_manager_dev
CONTAINER_NAME_DATABASE=barber_shop_manager_db_container
DOCKER_HOST_IP=172.17.0.1

# Configurações de JWT (se necessário)
JWT_SECRET="your-super-secret-jwt-key"
ACCESS_TOKEN_EXPIRATION=60s
REFRESH_TOKEN_EXPIRATION=7d

# Chaves RSA para JWT (Base64)
JWT_SECRET_PUBLIC_KEY=...
JWT_SECRET_PRIVATE_KEY=...
```

### 3. Inicialização do Prisma

```bash
# Inicializar Prisma (se ainda não foi feito)
npx prisma init
```

### 4. Configuração do Schema Prisma

O schema está em `prisma/schema.prisma` com os seguintes modelos:

```prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

// Modelo para clientes
model Client {
  id         String   @id @default(cuid())
  name       String
  email      String   @unique
  phone      String?
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  // Relacionamentos
  appointments Appointment[]

  @@map("clients")
}

// Modelo para barbeiros
model Barber {
  id         String   @id @default(cuid())
  name       String
  email      String   @unique
  phone      String?
  specialty  String? // Especialidade do barbeiro
  is_active  Boolean  @default(true)
  created_at DateTime @default(now())
  updated_at DateTime @updatedAt

  // Relacionamentos
  appointments Appointment[]

  @@map("barbers")
}

// Modelo para serviços
model Service {
  id          String   @id @default(cuid())
  name        String
  description String?
  price       Decimal  @db.Decimal(10, 2)
  duration    Int // Duração em minutos
  is_active   Boolean  @default(true)
  created_at  DateTime @default(now())
  updated_at  DateTime @updatedAt

  // Relacionamentos
  appointment_services AppointmentService[]

  @@map("services")
}

// Modelo para agendamentos
model Appointment {
  id          String            @id @default(cuid())
  client_id   String
  barber_id   String
  date_time   DateTime
  status      AppointmentStatus @default(SCHEDULED)
  total_price Decimal           @db.Decimal(10, 2)
  notes       String?
  created_at  DateTime          @default(now())
  updated_at  DateTime          @updatedAt

  // Relacionamentos
  client   Client               @relation(fields: [client_id], references: [id])
  barber   Barber               @relation(fields: [barber_id], references: [id])
  services AppointmentService[]

  @@map("appointments")
}

// Tabela de junção para agendamentos e serviços
model AppointmentService {
  id             String @id @default(cuid())
  appointment_id String
  service_id     String

  // Relacionamentos
  appointment Appointment @relation(fields: [appointment_id], references: [id], onDelete: Cascade)
  service     Service     @relation(fields: [service_id], references: [id])

  @@unique([appointment_id, service_id])
  @@map("appointment_services")
}

// Enum para status do agendamento
enum AppointmentStatus {
  SCHEDULED
  CONFIRMED
  IN_PROGRESS
  COMPLETED
  CANCELLED
  NO_SHOW
}
```

### 5. Migração do Banco de Dados

```bash
# Verificar status das migrações
npx prisma migrate status

# Gerar e executar a primeira migração
npx prisma migrate dev --name initial

# Gerar o cliente Prisma
npx prisma generate
```

### 6. Popular o Banco com Dados Iniciais (Seed)

O arquivo `prisma/seed.ts` já está configurado. Execute:

```bash
# Executar o seed
npx prisma db seed

# Verificar dados no Prisma Studio
npx prisma studio
```

**Resultado esperado do seed:**
```
🌱 Iniciando o seed do banco de dados...
✅ Criados 5 serviços
✅ Criados 3 barbeiros
✅ Criados 5 clientes
✅ Criados 3 agendamentos
✅ Serviços associados aos agendamentos
🎉 Seed concluído com sucesso!
```

## 🏗️ Integração com NestJS (Implementação Oficial)

### 1. PrismaService (Padrão Oficial)

Arquivo: `src/prisma/prisma.service.ts`

```typescript
import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}
```

### 2. PrismaModule (Global)

Arquivo: `src/prisma/prisma.module.ts`

```typescript
import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Global()
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
```

### 3. Integração no AppModule

Arquivo: `src/app.module.ts`

```typescript
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [
    // Configuração global do ambiente
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    
    // Configuração global do Prisma
    PrismaModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
```

### 4. Uso nos Services

Arquivo: `src/app.service.ts`

```typescript
import { Injectable } from '@nestjs/common';
import { PrismaService } from './prisma/prisma.service';

@Injectable()
export class AppService {
  constructor(private prisma: PrismaService) {}

  getHello(): string {
    return 'Barber Shop Manager - Sistema de Gerenciamento de Barbearia!';
  }

  // Exemplos de operações com o banco de dados

  // Buscar todos os clientes
  async getClients() {
    return this.prisma.client.findMany({
      orderBy: {
        created_at: 'desc',
      },
    });
  }

  // Buscar todos os barbeiros ativos
  async getActiveBarbers() {
    return this.prisma.barber.findMany({
      where: {
        is_active: true,
      },
      orderBy: {
        name: 'asc',
      },
    });
  }

  // Buscar estatísticas básicas
  async getStats() {
    const [clientsCount, barbersCount, servicesCount, appointmentsCount] = await Promise.all([
      this.prisma.client.count(),
      this.prisma.barber.count({ where: { is_active: true } }),
      this.prisma.service.count({ where: { is_active: true } }),
      this.prisma.appointment.count(),
    ]);

    return {
      clients: clientsCount,
      barbers: barbersCount,
      services: servicesCount,
      appointments: appointmentsCount,
    };
  }

  // Exemplo de criação de cliente
  async createClient(data: { name: string; email: string; phone?: string }) {
    return this.prisma.client.create({
      data,
    });
  }
}
```

## 🚀 Executando o Projeto

### 1. Scripts Disponíveis no package.json

```json
{
  "scripts": {
    "build": "nest build",
    "start": "nest start",
    "start:dev": "nest start --watch",
    "start:debug": "nest start --debug --watch",
    "start:prod": "node dist/main",
    
    "prisma:generate": "prisma generate",
    "prisma:migrate": "prisma migrate dev",
    "prisma:seed": "ts-node prisma/seed.ts",
    "prisma:studio": "prisma studio",
    "prisma:reset": "prisma migrate reset",
    "db:push": "prisma db push"
  },
  "prisma": {
    "seed": "ts-node prisma/seed.ts"
  }
}
```

### 2. Iniciar o Servidor

```bash
# Desenvolvimento (com watch)
npm run start:dev

# Produção
npm run build
npm run start:prod
```

**✅ Servidor rodando em:** `http://localhost:3333`

### 3. Endpoints Disponíveis

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| GET | `/api` | Mensagem de boas-vindas |
| GET | `/api/clients` | Listar todos os clientes |
| GET | `/api/barbers` | Listar barbeiros ativos |
| GET | `/api/services` | Listar serviços ativos |
| GET | `/api/appointments` | Listar agendamentos recentes |
| GET | `/api/stats` | Estatísticas básicas |
| POST | `/api/clients` | Criar novo cliente |

### 4. Testando os Endpoints

```bash
# Teste básico
curl http://localhost:3333/api

# Estatísticas
curl http://localhost:3333/api/stats
# Resposta: {"clients":5,"barbers":3,"services":5,"appointments":3}

# Listar clientes
curl http://localhost:3333/api/clients

# Criar cliente
curl -X POST http://localhost:3333/api/clients \
  -H "Content-Type: application/json" \
  -d '{
    "name": "João Silva",
    "email": "joao@email.com",
    "phone": "(11) 99999-9999"
  }'
```

## 🔧 Comandos Úteis do Prisma

```bash
# Gerar cliente após mudanças no schema
npm run prisma:generate

# Aplicar migrações
npm run prisma:migrate

# Ver dados no navegador (Prisma Studio)
npm run prisma:studio

# Popular banco com dados iniciais
npm run prisma:seed

# Resetar banco e aplicar seed
npm run prisma:reset

# Push schema sem criar migração (desenvolvimento)
npm run db:push

# Verificar status das migrações
npx prisma migrate status

# Criar nova migração
npx prisma migrate dev --name nome-da-migracao
```

## 💡 Exemplos de Queries Avançadas

```typescript
// Buscar cliente com agendamentos completos
const clientWithAppointments = await prisma.client.findUnique({
  where: { id: 'client-id' },
  include: {
    appointments: {
      include: {
        barber: {
          select: { name: true, specialty: true }
        },
        services: {
          include: {
            service: {
              select: { name: true, price: true, duration: true }
            }
          }
        }
      },
      orderBy: { date_time: 'desc' }
    }
  }
});

// Criar agendamento com múltiplos serviços
const appointment = await prisma.appointment.create({
  data: {
    client_id: 'client-id',
    barber_id: 'barber-id',
    date_time: new Date('2024-12-08T14:00:00'),
    total_price: 75.00,
    status: 'SCHEDULED',
    services: {
      create: [
        { service_id: 'service-1-id' },
        { service_id: 'service-2-id' }
      ]
    }
  },
  include: {
    client: true,
    barber: true,
    services: {
      include: { service: true }
    }
  }
});

// Buscar agendamentos por período
const appointmentsByPeriod = await prisma.appointment.findMany({
  where: {
    date_time: {
      gte: new Date('2024-12-01'),
      lte: new Date('2024-12-31')
    },
    status: {
      in: ['SCHEDULED', 'CONFIRMED']
    }
  },
  include: {
    client: { select: { name: true, phone: true } },
    barber: { select: { name: true } },
    services: {
      include: {
        service: { select: { name: true, duration: true } }
      }
    }
  },
  orderBy: { date_time: 'asc' }
});
```

## ✅ Vantagens da Implementação Oficial

1. **✨ Simplicidade**: Sem dependências externas desnecessárias
2. **📚 Padrão Oficial**: Segue exatamente a documentação do NestJS
3. **🎛️ Controle Total**: Controle completo sobre o ciclo de vida da conexão
4. **⚡ Performance**: Conexão otimizada com `OnModuleInit` e `OnModuleDestroy`
5. **🔒 TypeScript**: Tipagem completa gerada automaticamente pelo Prisma
6. **🐳 Docker Ready**: Configurado para trabalhar com containers
7. **🔄 Hot Reload**: Funciona perfeitamente com o sistema de watch do NestJS

## 🎯 Próximos Passos Recomendados

- [ ] Implementar autenticação JWT (estrutura já preparada)
- [ ] Criar módulos específicos (ClientsModule, BarbersModule, ServicesModule)
- [ ] Adicionar validação com class-validator e class-transformer
- [ ] Implementar DTOs para requests e responses
- [ ] Adicionar documentação Swagger/OpenAPI
- [ ] Implementar testes unitários e de integração
- [ ] Configurar Docker Compose completo
- [ ] Adicionar logging estruturado
- [ ] Implementar cache com Redis
- [ ] Configurar CI/CD pipeline

## 🐛 Troubleshooting

### Erro de Conexão com o Banco

```bash
# Verificar se o container está rodando
docker ps | grep postgres

# Verificar logs do container
docker logs barber_shop_manager_db_container

# Testar conexão manual
psql postgresql://barber_shop_manager_db_dev_user:barber_shop_manager_db_dev_password@172.17.0.1:5432/barber_shop_manager_db_dev
```

### Cliente Prisma Desatualizado

```bash
npm run prisma:generate
```

### Problemas com Migrações

```bash
# Reset completo (CUIDADO: apaga todos os dados)
npm run prisma:reset

# Verificar status
npx prisma migrate status
```

### Porta já em Uso

```bash
# Verificar processos na porta 3333
lsof -i :3333

# Matar processo se necessário
kill -9 <PID>
```

## 📖 Referências Oficiais

- [📘 Documentação Oficial NestJS + Prisma](https://docs.nestjs.com/recipes/prisma)
- [📗 Documentação do Prisma](https://www.prisma.io/docs)
- [📙 Guia de Migração do Prisma](https://www.prisma.io/docs/guides/database/developing-with-prisma-migrate)
- [📕 Prisma Client API Reference](https://www.prisma.io/docs/reference/api-reference/prisma-client-reference)
- [📔 NestJS Configuration](https://docs.nestjs.com/techniques/configuration)

---

**✅ Setup Completo e Funcional!** 💈 

**Último Update:** Dezembro 2024  
**Versão do Prisma:** 6.11.0  
**Versão do NestJS:** 11.0.1 