# 🔄 Refatoração Paralela - Módulo Members

## 📋 Visão Geral

Este documento descreve a estratégia de refatoração paralela para criar o módulo `members` independente, que substituirá gradualmente o módulo `establishment-members` atual. O novo módulo será responsável por gerenciar membros (funcionários) dos estabelecimentos de forma mais eficiente e organizada.

## 🎯 Objetivos da Refatoração

### **Mudanças Principais:**
1. **Criar módulo `members/`** paralelo ao `establishment-members/`
2. **Implementar CRUD completo** para membros
3. **Criar classe auxiliar** para validações de acesso ao estabelecimento
4. **Adicionar novos ErrorCodes** específicos para membros
5. **Manter compatibilidade** com sistema atual durante transição

### **Regras de Negócio:**
- Apenas um membro com mesmo email por estabelecimento
- Apenas um membro com mesmo telefone por estabelecimento
- Apenas donos (OWNER) podem criar membros
- Validação de acesso ao estabelecimento obrigatória

## 🚨 Impactos Identificados

### **1. Novos ErrorCodes Necessários:**
- [X] `MEMBER_EMAIL_ALREADY_EXISTS` - Email já existe no estabelecimento
- [X] `MEMBER_PHONE_ALREADY_EXISTS` - Telefone já existe no estabelecimento
- [X] `MEMBER_NOT_FOUND` - Membro não encontrado
- [X] `MEMBER_CREATION_FAILED` - Falha na criação do membro

### **2. Módulos que precisam ser criados:**
- [X] `members/` (completamente novo)
- [X] `member-auth/` (para autenticação de membros)
- [ ] Classe auxiliar para validações de estabelecimento

### **3. Relacionamentos que mudam:**
- [ ] Todos os relacionamentos que usam `userId + establishmentId` como chave composta
- [ ] Relacionamentos que referenciam `User` através de `EstablishmentMember`

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

// Adicionar relacionamento com User/Dono no Establishment
model Establishment {
  id          String @id @default(uuid())
  name        String
  phone       String
  address     String?
  ownerId     String  // ID do dono (User)
  owner       User    @relation(fields: [ownerId], references: [id], onDelete: Cascade)
  
  // ... resto da estrutura atual
  members     Member[]
  
  @@unique([ownerId, phone])
  @@map("establishments")
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
- [X] Criar modelo `Member` no schema
- [X] Criar modelo `MemberRefreshToken` 
- [X] Adicionar relacionamento `ownerId` no `Establishment`
- [X] Adicionar `OWNER` ao enum `Role`
- [X] Criar migration para novos modelos
- [X] Criar módulo `members/` completo
- [X] Criar módulo `member-auth/` para autenticação

**Duração estimada:** 1-2 dias
**Status:** ✅ **CONCLUÍDA (100%)**

### **Fase 2: Desenvolvimento Paralelo**
- [X] Implementar CRUD completo para `Member`
- [X] Implementar autenticação para membros
- [ ] Implementar verificação de email para membros
- [X] Criar DTOs e validações específicas
- [X] Implementar testes para nova estrutura

**Duração estimada:** 3-5 dias
**Status:** ✅ **CONCLUÍDA (90%)**

### **Fase 3: Migração Gradual de Funcionalidades**
- [X] Migrar `member-products/` para usar `Member`
- [X] Migrar `member-services/` para usar `Member`
- [ ] Migrar agendamentos para usar `Member`
- [ ] Migrar transações para usar `Member`

**Duração estimada:** 2-3 dias
**Status:** ⚠️ **PARCIAL (50%)**

### **Fase 4: Transição e Limpeza**
- [ ] Migrar dados existentes
- [ ] Atualizar dependências
- [ ] Remover módulos antigos
- [ ] Limpar código não utilizado

**Duração estimada:** 1-2 dias
**Status:** ❌ **NÃO INICIADA (0%)**

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
    TokenModule, // Módulo compartilhado
  ],
})
export class AppModule {}
```

### **4. TokenService Compartilhado:**
```typescript
// src/shared/token/token.service.ts
@Injectable()
export class TokenService {
  async generateTokens(payload: JwtPayload) {
    // Gera tokens para ambos os tipos de usuário
    // Usa o mesmo payload { sub: id }
  }
}
```

### **5. Payload Padronizado:**
```typescript
// Mesmo padrão para Users e Members
interface JwtPayload {
  sub: string; // ID do usuário/membro
}

interface AuthenticatedUser {
  id: string;
}

interface AuthenticatedMember {
  id: string;
}
```

## 📊 Cronograma Detalhado

| Fase | Duração | Objetivo | Entregáveis | Status |
|------|---------|----------|-------------|--------|
| **Fase 1** | 1-2 dias | Infraestrutura paralela | Schema, migrations, módulos base | ✅ **CONCLUÍDA** |
| **Fase 2** | 3-5 dias | Desenvolvimento completo | CRUD, auth, validações, testes | ✅ **CONCLUÍDA** |
| **Fase 3** | 2-3 dias | Migração gradual | Módulos dependentes migrados | ⚠️ **PARCIAL** |
| **Fase 4** | 1-2 dias | Limpeza e finalização | Sistema unificado, código limpo | ❌ **NÃO INICIADA** |

## 🎯 Próximos Passos

1. **Criar o novo schema** com modelo `Member` ✅ **CONCLUÍDO**
2. **Implementar módulo `members/`** completo ✅ **CONCLUÍDO**
3. **Implementar autenticação para membros** ✅ **CONCLUÍDO**
4. **Testar funcionalidades em paralelo** ⚠️ **PARCIAL**
5. **Migrar gradualmente as dependências** ⚠️ **PARCIAL**

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
**Versão:** 1.1
**Status:** Em desenvolvimento 
**Última atualização:** $(date) 