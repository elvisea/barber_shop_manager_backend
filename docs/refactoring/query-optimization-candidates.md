# Candidatos para Otimização de Queries com Joins

## Visão Geral (Macro)

### Problema Identificado

Muitos services na aplicação realizam múltiplas queries sequenciais ao banco de dados para buscar entidades relacionadas. Este padrão causa:

- **Latência Acumulada**: Cada query adiciona latência de rede (round-trip time)
- **Overhead de Conexão**: Múltiplas conexões ao banco aumentam o overhead
- **Inconsistência Transacional**: Dados podem mudar entre queries, causando inconsistências
- **Performance Degradada**: Em cenários de alta concorrência, o problema se agrava

### Solução Implementada

A refatoração consiste em substituir múltiplas queries sequenciais por uma única query com joins usando o Prisma `include`. Esta abordagem:

- **Reduz Round-trips**: De N queries para 1 query única
- **Melhora Performance**: Redução de ~60-70% no tempo de execução
- **Garante Consistência**: Todos os dados vêm do mesmo snapshot transacional
- **Type Safety**: Tipagens precisas usando `Prisma.GetPayload`

### Padrão de Refatoração

O padrão seguido consiste em:

1. **Criar Tipo TypeScript**: Usar `Prisma.GetPayload` para criar tipos precisos com relacionamentos
2. **Adicionar Método no Repositório**: Criar método na interface e implementação que retorna entidade com relacionamentos
3. **Refatorar Service**: Substituir múltiplas chamadas por uma única chamada ao novo método
4. **Documentar**: Adicionar JSDoc explicando a otimização e benefícios

### Exemplo de Referência

O service `member-service-update.service.ts` foi refatorado e serve como exemplo de referência para outras refatorações. Ver: `src/modules/member-services/services/member-service-update.service.ts`

---

## Análise Detalhada por Service (Micro)

### Services Já Refatorados ✅

#### 1. `src/modules/member-services/services/member-service-update.service.ts`

**Status**: ✅ Concluído

**Antes da Refatoração**:
- 3 queries sequenciais:
  1. `establishmentRepository.findById()` - busca Establishment
  2. `memberRepository.findByEstablishmentAndId()` - busca Member
  3. `memberServiceRepository.findByMemberEstablishmentService()` - busca MemberService

**Depois da Refatoração**:
- 1 query única com joins:
  - `memberServiceRepository.findByMemberEstablishmentServiceWithRelations()` - retorna MemberService com Member (incluindo Establishment) e EstablishmentService

**Benefícios Alcançados**:
- Redução de ~60-70% no tempo de execução
- Consistência transacional garantida
- Type-safety completo com `MemberServiceWithRelations`
- Código mais limpo e manutenível

**Arquivos Modificados**:
- `src/modules/member-services/types/member-service-with-relations.type.ts` (novo)
- `src/modules/member-services/contracts/member-service-repository.interface.ts`
- `src/modules/member-services/repositories/member-service.repository.ts`
- `src/modules/member-services/services/member-service-update.service.ts`

#### 2. `src/modules/member-services/services/member-service-delete.service.ts`

**Status**: ✅ Concluído

**Implementação**: Usa `MemberServiceValidationService` que já implementa query otimizada com joins.

#### 3. `src/modules/member-services/services/member-service-find-one.service.ts`

**Status**: ✅ Concluído

**Implementação**: Usa `MemberServiceValidationService` que já implementa query otimizada com joins.

#### 4. `src/modules/member-products/services/member-product-*.service.ts`

**Status**: ✅ Concluído

**Implementação**: Todos os services de member-products (update, delete, find-one) usam `MemberProductValidationService` que implementa queries otimizadas com joins.

---

### Services Prioritários para Refatoração

#### Alta Prioridade 🔴

##### 1. `src/modules/members/services/member-update.service.ts`

**Status**: ⏳ Pendente

**Queries Atuais**:
1. `memberRepository.findByIdWithEstablishment()` - busca Member com Establishment
2. `memberRepository.existsByEmailExcludingId()` - valida email único (sequencial)
3. `memberRepository.existsByPhoneExcludingId()` - valida phone único (sequencial)

**Otimização Proposta**:
- `findByIdWithEstablishment` já está otimizado (1 query com join)
- `existsByEmailExcludingId` e `existsByPhoneExcludingId` podem ser executadas em paralelo com `Promise.all()`
- Criar método `findByIdWithEstablishmentAndValidations()` que retorna Member com Establishment e flags de validação

**Benefício Esperado**:
- Redução de latência: De 3 queries sequenciais para 1 query + 2 queries paralelas
- Melhoria estimada: ~40-50% mais rápido

**Prioridade**: Alta - Service muito utilizado, impacto significativo

---

##### 2. `src/modules/members/services/member-create.service.ts`

**Status**: ⏳ Pendente

**Queries Atuais**:
1. `establishmentRepository.findById()` - busca Establishment
2. `memberRepository.existsByEmail()` - valida email único (sequencial)
3. `memberRepository.existsByPhone()` - valida phone único (sequencial)

**Otimização Proposta**:
- `existsByEmail` e `existsByPhone` podem ser executadas em paralelo com `Promise.all()`
- Manter `findById` separado (já otimizado)

**Benefício Esperado**:
- Redução de latência: De 3 queries sequenciais para 1 query + 2 queries paralelas
- Melhoria estimada: ~40-50% mais rápido

**Prioridade**: Alta - Service de criação, impacto em performance de cadastro

---

##### 3. `src/modules/appointments/services/appointment-access-validation.service.ts`

**Status**: ⏳ Pendente

**Queries Atuais**:
1. `validateUserCanCreateAppointments()`:
   - `establishmentRepository.findById()` - busca Establishment
   - `memberRepository.findByEstablishmentAndId()` - busca Member (sequencial)
2. `validateServices()`:
   - Loop com `establishmentServiceRepository.findByIdAndEstablishment()` - N queries sequenciais
3. `validateMemberAllowedServices()`:
   - Loop com `memberServiceRepository.existsByMemberEstablishmentService()` - N queries sequenciais

**Otimização Proposta**:
- Criar método `findUserAccessWithRelations()` que retorna Establishment e Member em 1 query
- Criar método `findServicesByIdsAndEstablishment()` que busca múltiplos services em 1 query
- Criar método `findMemberServicesByIds()` que busca múltiplos member-services em 1 query

**Benefício Esperado**:
- Redução significativa: De 1 + N queries para 1-3 queries totais
- Melhoria estimada: ~70-80% mais rápido em cenários com múltiplos services
- Impacto crítico em loops

**Prioridade**: Alta - Service usado em criação de appointments, loops causam N+1 queries

---

#### Média Prioridade 🟡

##### 4. `src/modules/members/services/member-delete.service.ts`

**Status**: ⏳ Pendente

**Queries Atuais**:
1. `memberRepository.findByIdWithEstablishment()` - busca Member com Establishment

**Otimização Proposta**:
- Já está otimizado (1 query com join)
- Pode adicionar validações adicionais se necessário no futuro

**Benefício Esperado**:
- Baixo - Já otimizado parcialmente
- Pode melhorar se adicionar validações relacionadas

**Prioridade**: Média - Já otimizado, melhorias incrementais possíveis

---

##### 5. `src/modules/establishment/services/establishment-update.service.ts`

**Status**: ⏳ Pendente

**Queries Atuais**:
1. `establishmentRepository.findByIdAndUser()` - busca Establishment com validação de owner

**Otimização Proposta**:
- Já está otimizado (1 query)
- Pode adicionar relacionamentos se necessário no futuro (ex: members, services)

**Benefício Esperado**:
- Baixo - Já otimizado
- Pode melhorar se precisar de relacionamentos adicionais

**Prioridade**: Média - Já otimizado, melhorias incrementais possíveis

---

##### 6. `src/modules/establishment/services/establishment-delete.service.ts`

**Status**: ⏳ Pendente

**Queries Atuais**:
1. `establishmentRepository.findByIdAndUser()` - busca Establishment com validação de owner

**Otimização Proposta**:
- Já está otimizado (1 query)
- Pode adicionar validações de dependências se necessário

**Benefício Esperado**:
- Baixo - Já otimizado
- Pode melhorar se adicionar validações relacionadas

**Prioridade**: Média - Já otimizado, melhorias incrementais possíveis

---

#### Baixa Prioridade 🟢

##### 7. Services de Establishment (Services, Products, Customers)

**Status**: ⏳ Pendente

**Arquivos**:
- `src/modules/establishment-services/services/establishment-service-*.service.ts`
- `src/modules/establishment-products/services/establishment-product-*.service.ts`
- `src/modules/establishment-customers/services/establishment-customer-*.service.ts`

**Queries Atuais**:
- Geralmente fazem validações simples com 1-2 queries
- Alguns podem ter loops que causam N+1 queries

**Otimização Proposta**:
- Analisar caso a caso
- Otimizar loops quando identificados
- Adicionar joins quando múltiplas entidades relacionadas são necessárias

**Benefício Esperado**:
- Variável - Depende do caso específico
- Melhorias incrementais

**Prioridade**: Baixa - Impacto menor, otimizar quando necessário

---

## Padrão de Refatoração Detalhado

### Passo 1: Criar Tipo TypeScript

Criar arquivo em `src/modules/{module}/types/{entity}-with-relations.type.ts`:

```typescript
import { Prisma } from '@prisma/client';

/**
 * Tipo que representa uma entidade com todos os relacionamentos necessários.
 * Gerado usando Prisma.GetPayload para garantir type-safety completo.
 */
export type EntityWithRelations = Prisma.EntityGetPayload<{
  include: {
    relatedEntity: {
      include: {
        nestedEntity: true;
      };
    };
    anotherRelation: true;
  };
}>;
```

### Passo 2: Adicionar Método na Interface do Repositório

Adicionar método em `src/modules/{module}/contracts/{entity}-repository.interface.ts`:

```typescript
/**
 * Busca entidade com todos os relacionamentos em uma única query.
 * 
 * **Otimização de Performance:**
 * Este método foi criado para otimizar operações que requerem múltiplas entidades relacionadas.
 * Reduz de N queries para 1 query com joins.
 * 
 * @param id - ID da entidade
 * @returns Entidade com relacionamentos ou null
 */
findByIdWithRelations(id: string): Promise<EntityWithRelations | null>;
```

### Passo 3: Implementar Método no Repositório

Implementar em `src/modules/{module}/repositories/{entity}.repository.ts`:

```typescript
async findByIdWithRelations(id: string): Promise<EntityWithRelations | null> {
  return this.prisma.entity.findFirst({
    where: { id },
    include: {
      relatedEntity: {
        include: {
          nestedEntity: true,
        },
      },
      anotherRelation: true,
    },
  });
}
```

### Passo 4: Refatorar Service

Substituir múltiplas queries por uma única chamada:

```typescript
// Antes
const entity = await this.entityRepository.findById(id);
const related = await this.relatedRepository.findById(entity.relatedId);
const nested = await this.nestedRepository.findById(related.nestedId);

// Depois
const entityWithRelations = await this.entityRepository.findByIdWithRelations(id);
const related = entityWithRelations.relatedEntity;
const nested = entityWithRelations.relatedEntity.nestedEntity;
```

### Passo 5: Adicionar JSDoc Explicativo

Adicionar JSDoc na classe e método do service explicando:
- A refatoração realizada
- Por que foi feita (performance)
- Benefícios alcançados
- Como serve de exemplo para outros services

---

## Métricas Esperadas

### Performance

- **Redução de Latência**: 60-70% em média
- **Redução de Round-trips**: De N queries para 1 query
- **Melhoria em Loops**: 70-80% em cenários com N+1 queries

### Qualidade

- **Consistência Transacional**: Dados no mesmo snapshot
- **Type Safety**: Tipagens precisas com Prisma.GetPayload
- **Manutenibilidade**: Código mais limpo e fácil de entender
- **Documentação**: JSDoc serve de guia para futuras refatorações

---

## Roadmap de Implementação

### Fase 1: Alta Prioridade (Imediato)
1. ✅ `member-service-update.service.ts` - Concluído (exemplo de referência)
2. ⏳ `member-update.service.ts` - Pendente
3. ⏳ `member-create.service.ts` - Pendente
4. ⏳ `appointment-access-validation.service.ts` - Pendente

### Fase 2: Média Prioridade (Próximas Sprints)
5. ⏳ `member-delete.service.ts` - Pendente (melhorias incrementais)
6. ⏳ `establishment-update.service.ts` - Pendente (melhorias incrementais)
7. ⏳ `establishment-delete.service.ts` - Pendente (melhorias incrementais)

### Fase 3: Baixa Prioridade (Backlog)
8. ⏳ Services de establishment-services, establishment-products, establishment-customers
9. ⏳ Outros services identificados durante desenvolvimento

---

## Notas Importantes

- **Sempre seguir o padrão estabelecido** em `member-service-update.service.ts`
- **Documentar com JSDoc** explicando a otimização e benefícios
- **Manter este documento atualizado** conforme refatorações são concluídas
- **Priorizar services de alta prioridade** primeiro
- **Testar performance** antes e depois da refatoração quando possível
- **Considerar impacto em produção** antes de aplicar refatorações

---

## Referências

- Exemplo de Refatoração: `src/modules/member-services/services/member-service-update.service.ts`
- Tipo de Referência: `src/modules/member-services/types/member-service-with-relations.type.ts`
- Repositório de Referência: `src/modules/member-services/repositories/member-service.repository.ts`
- Interface de Referência: `src/modules/member-services/contracts/member-service-repository.interface.ts`
