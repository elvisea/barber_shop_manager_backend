# 🔄 Refatoração Paralela - EstablishmentMember para Member

## 📋 Visão Geral

Este documento descreve a estratégia de refatoração paralela para transformar a tabela `EstablishmentMember` (atualmente uma tabela pivô) em uma tabela `Member` independente, mantendo a estrutura atual funcionando durante todo o processo de transição.

## 🎯 Objetivos da Refatoração

### **Mudanças Principais:**
1. **EstablishmentMember** deixará de ser tabela pivô e se tornará a tabela de membros
2. **User** será apenas para proprietários/donos de estabelecimentos
3. **Member** terá: `id`, `name`, `email`, `phone`, `password`, `role`, `establishmentId`
4. Adicionar `OWNER` ao enum `Role`
5. Verificação de email para membros
6. RefreshTokens para membros

### **Regras de Negócio:**
- Apenas um membro com mesmo email por estabelecimento
- Apenas um membro com mesmo phone por estabelecimento
- Usuários/proprietários terão role `OWNER` por padrão

## 🚨 Impactos Identificados

### **1. Tabelas que dependem de EstablishmentMember:**
- `MemberProduct` (userId + establishmentId)
- `MemberService` (userId + establishmentId) 
- `MemberWorkingHours` (userId + establishmentId)
- `MemberAbsencePeriod` (userId + establishmentId)
- `Appointment` (memberId + establishmentId)
- `Transaction` (memberId + establishmentId)
- `PaymentOrder` (memberId + establishmentId)
- `Subscription` (establishmentMemberUserId + establishmentMemberEstablishmentId)

### **2. Módulos que precisam ser refatorados:**
- `establishment-members/` (completamente)
- `member-products/` (adaptar para novo ID)
- `member-services/` (adaptar para novo ID)
- `auth/` (suporte para autenticação de membros)
- `refresh-token/` (suporte para membros)

### **3. Relacionamentos que mudam:**
- Todos os relacionamentos que usam `userId + establishmentId` como chave composta
- Relacionamentos que referenciam `User` através de `EstablishmentMember`

### **4. Relacionamentos herdados pelo novo modelo Member:**
O novo modelo `Member` herdará todos os relacionamentos que `EstablishmentMember` possui:

- **memberProducts** - Produtos que o membro pode vender (MemberProduct[])
- **memberServices** - Serviços que o membro pode fazer (MemberService[])
- **workingHours** - Horários de trabalho do membro (MemberWorkingHours[])
- **absencePeriods** - Períodos de ausência do membro (MemberAbsencePeriod[])
- **appointments** - Agendamentos do membro (Appointment[])
- **transactions** - Transações realizadas pelo membro (Transaction[])
- **paymentOrders** - Ordens de pagamento para o membro (PaymentOrder[])
- **subscriptions** - Assinaturas vinculadas ao membro (Subscription[])

**Implicações:**
- Todos esses relacionamentos precisarão ser migrados para usar `memberId` em vez de `userId + establishmentId`
- As tabelas relacionadas precisarão ser adaptadas para a nova estrutura
- A migração de dados deve preservar todos os relacionamentos existentes

## 🎯 Estratégia de Refatoração Paralela

### **Estrutura Paralela Proposta:**

#### **1. Schema Prisma - Modelos Paralelos:**
```prisma
// Modelo atual (mantido)
model EstablishmentMember {
  userId          String
  establishmentId String
  role            Role
  // ... resto da estrutura atual
}

// Novo modelo (paralelo)
model Member {
  id              String @id @default(uuid())
  name            String
  email           String
  phone           String
  password        String
  role            Role
  emailVerified   Boolean @default(false)
  isActive        Boolean @default(true)
  establishmentId String
  establishment   Establishment @relation(fields: [establishmentId], references: [id], onDelete: Cascade)
  
  // Relacionamentos herdados de EstablishmentMember
  memberProducts  MemberProduct[]      // Produtos que ele pode vender
  memberServices  MemberService[]      // Serviços que ele pode fazer
  workingHours    MemberWorkingHours[] // Horários de trabalho
  absencePeriods  MemberAbsencePeriod[] // Períodos de ausência
  appointments    Appointment[]        // Agendamentos
  transactions    Transaction[]        // Transações realizadas
  paymentOrders   PaymentOrder[]       // Ordens de pagamento
  subscriptions   Subscription[]       // Assinaturas vinculadas
  
  // Relacionamentos específicos do Member
  refreshTokens   MemberRefreshToken[] // Refresh tokens para autenticação
  
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt

  @@unique([establishmentId, email])
  @@unique([establishmentId, phone])
  @@map("members")
}

// Novo modelo para refresh tokens de membros
model MemberRefreshToken {
  id        String   @id @default(uuid())
  token     String   @unique
  expiresAt DateTime
  revoked   Boolean  @default(false)
  userAgent String?
  ipAddress String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  memberId  String
  member    Member   @relation(fields: [memberId], references: [id], onDelete: Cascade)

  @@map("member_refresh_tokens")
}
```

#### **2. Módulos Paralelos:**
```
src/modules/
├── establishment-members/     # Módulo atual (mantido)
├── members/                   # Novo módulo (paralelo)
│   ├── controllers/
│   │   ├── member-create.controller.ts
│   │   ├── member-delete.controller.ts
│   │   ├── member-find-all.controller.ts
│   │   ├── member-find-by-id.controller.ts
│   │   └── member-update.controller.ts
│   ├── services/
│   │   ├── member-create.service.ts
│   │   ├── member-delete.service.ts
│   │   ├── member-find-all.service.ts
│   │   ├── member-find-by-id.service.ts
│   │   └── member-update.service.ts
│   ├── repositories/
│   │   └── member.repository.ts
│   ├── dtos/
│   │   ├── member-create-request.dto.ts
│   │   ├── member-create-response.dto.ts
│   │   ├── member-find-all-query.dto.ts
│   │   ├── member-find-by-id-response.dto.ts
│   │   ├── member-update-request.dto.ts
│   │   └── member-param.dto.ts
│   ├── contracts/
│   │   └── member-repository.interface.ts
│   └── members.module.ts
└── member-auth/              # Novo módulo de autenticação para membros
    ├── controllers/
    │   └── member-auth.controller.ts
    ├── services/
    │   ├── member-auth.service.ts
    │   └── member-token.service.ts
    ├── strategies/
    │   └── member-jwt.strategy.ts
    ├── guards/
    │   └── member-jwt-auth.guard.ts
    ├── dtos/
    │   ├── member-auth-request.dto.ts
    │   └── member-auth-response.dto.ts
    └── member-auth.module.ts
```

## 📅 Fases da Refatoração Paralela

### **Fase 1: Criação da Infraestrutura Paralela**
- [ ] Criar modelo `Member` no schema
- [ ] Criar modelo `MemberRefreshToken` 
- [ ] Adicionar `OWNER` ao enum `Role`
- [ ] Criar migration para novos modelos
- [ ] Criar módulo `members/` completo
- [ ] Criar módulo `member-auth/` para autenticação

**Duração estimada:** 1-2 dias

### **Fase 2: Desenvolvimento Paralelo**
- [ ] Implementar CRUD completo para `Member`
- [ ] Implementar autenticação para membros
- [ ] Implementar verificação de email para membros
- [ ] Criar DTOs e validações específicas
- [ ] Implementar testes para nova estrutura

**Duração estimada:** 3-5 dias

### **Fase 3: Migração Gradual de Funcionalidades**
- [ ] Migrar `member-products/` para usar `Member`
- [ ] Migrar `member-services/` para usar `Member`
- [ ] Migrar agendamentos para usar `Member`
- [ ] Migrar transações para usar `Member`

**Duração estimada:** 2-3 dias

### **Fase 4: Transição e Limpeza**
- [ ] Migrar dados existentes
- [ ] Atualizar dependências
- [ ] Remover módulos antigos
- [ ] Limpar código não utilizado

**Duração estimada:** 1-2 dias

## 🎯 Vantagens desta Estratégia

### **✅ Segurança:**
- Sistema atual continua funcionando
- Sem downtime durante transição
- Rollback fácil se necessário

### **✅ Desenvolvimento:**
- Desenvolvimento independente
- Testes isolados
- Validação gradual

### **✅ Negócio:**
- Funcionalidades não param
- Migração controlada
- Menor risco

## 🚨 Considerações Técnicas

### **1. Autenticação Dual:**
```typescript
// Estratégia JWT para Users (proprietários)
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  // ... lógica atual
}

// Nova estratégia JWT para Members (funcionários)
@Injectable()
export class MemberJwtStrategy extends PassportStrategy(Strategy, 'member-jwt') {
  // ... lógica para membros
}
```

### **2. Guards Específicos:**
```typescript
// Guard para proprietários
@UseGuards(JwtAuthGuard)
export class OwnerController {}

// Guard para funcionários
@UseGuards(MemberJwtAuthGuard)
export class MemberController {}
```

### **3. Módulos Independentes:**
```typescript
// app.module.ts
@Module({
  imports: [
    // Módulos atuais (mantidos)
    EstablishmentMembersModule,
    
    // Novos módulos (paralelos)
    MembersModule,
    MemberAuthModule,
  ],
})
export class AppModule {}
```

### **4. Validações Únicas:**
```typescript
// Validação de email único por estabelecimento
@IsEmail()
@ValidateBy({
  name: 'uniqueEmailPerEstablishment',
  validator: {
    validate: async (value, args) => {
      // Lógica de validação
    }
  }
})
email: string;

// Validação de phone único por estabelecimento
@IsPhoneNumber()
@ValidateBy({
  name: 'uniquePhonePerEstablishment',
  validator: {
    validate: async (value, args) => {
      // Lógica de validação
    }
  }
})
phone: string;
```

## 📊 Cronograma Detalhado

| Fase | Duração | Objetivo | Entregáveis |
|------|---------|----------|-------------|
| **Fase 1** | 1-2 dias | Infraestrutura paralela | Schema, migrations, módulos base |
| **Fase 2** | 3-5 dias | Desenvolvimento completo | CRUD, auth, validações, testes |
| **Fase 3** | 2-3 dias | Migração gradual | Módulos dependentes migrados |
| **Fase 4** | 1-2 dias | Limpeza e finalização | Sistema unificado, código limpo |

## 🎯 Próximos Passos

1. **Criar o novo schema** com modelo `Member`
2. **Implementar módulo `members/`** completo
3. **Implementar autenticação para membros**
4. **Testar funcionalidades em paralelo**
5. **Migrar gradualmente as dependências**

## 📝 Notas de Implementação

### **Boas Práticas a Seguir:**
- Manter padrões de nomenclatura consistentes
- Documentar todas as mudanças
- Implementar testes para cada funcionalidade
- Seguir as regras de commit estabelecidas
- Manter compatibilidade com APIs existentes

### **Pontos de Atenção:**
- Validação de dados únicos por estabelecimento
- Tratamento de refresh tokens para membros
- Verificação de email para novos membros
- Migração segura de dados existentes
- Compatibilidade com sistema de permissões
- **Migração de relacionamentos complexos** - Todos os relacionamentos de EstablishmentMember precisam ser preservados
- **Integridade referencial** - Garantir que nenhum dado seja perdido durante a transição
- **Performance** - Considerar o impacto da mudança de chave composta para chave simples

---

**Documento criado em:** $(date)
**Versão:** 1.0
**Status:** Em desenvolvimento 