# Padrão de Datas UTC - Barber Shop Manager

## Visão Geral

Este documento descreve o padrão de datas UTC implementado no projeto, seguindo as melhores práticas da indústria para aplicações internacionais.

## Princípios Fundamentais

### 1. Backend sempre trabalha com UTC

- Todas as datas são armazenadas em UTC usando `TIMESTAMPTZ` no PostgreSQL
- Backend nunca converte timezone (isso é responsabilidade do frontend)
- Backend recebe e retorna ISO strings em UTC
- Esta abordagem funciona para usuários em qualquer parte do mundo

### 2. Frontend é responsável por conversões

- Frontend usa `date-fns-tz` para todas as conversões de timezone
- Frontend detecta timezone do usuário automaticamente do navegador
- Frontend converte UTC ↔ timezone do usuário usando `date-fns-tz`
- Backend não precisa saber sobre timezone do usuário

### 3. Campo opcional de timezone no User

- Campo `timezone` no modelo `User` (opcional)
- Permite que usuário configure seu timezone preferido
- Frontend usa esse timezone se disponível, senão detecta do navegador
- Não é obrigatório - funciona sem ele (detecção automática)

## Fluxo Correto

```
Frontend (horário local do usuário)
  ↓ [converte para UTC]
  → ISO String em UTC (ex: "2025-12-20T20:00:00.000Z")
  ↓
Backend recebe ISO String em UTC
  ↓ [converte para Date object - já em UTC]
  → new Date(isoString) → Date object (UTC)
  ↓
Prisma salva usando @db.Timestamptz
  ↓ [PostgreSQL converte automaticamente para UTC]
  → PostgreSQL armazena em UTC (TIMESTAMPTZ)
  ↓
Backend retorna Date object (UTC)
  ↓ [NestJS serializa automaticamente para ISO string em UTC]
  → ISO String em UTC (ex: "2025-12-20T20:00:00.000Z")
  ↓ [frontend converte para timezone local]
Frontend exibe no horário local do usuário
```

## Regras de Ouro

### ✅ SEMPRE fazer:

- Usar `@db.Timestamptz` em todos os campos `DateTime` no Prisma
- Receber ISO strings em UTC do frontend
- Retornar ISO strings em UTC para o frontend
- Trabalhar com `Date` objects no backend (eles já representam UTC internamente)
- Deixar PostgreSQL fazer a conversão automaticamente com `TIMESTAMPTZ`
- Armazenar timezone do usuário no modelo User (opcional, para futuro)
- Nunca converter timezone no backend - sempre trabalhar com UTC

### ❌ NUNCA fazer:

- Usar `TIMESTAMP` sem timezone no PostgreSQL
- Converter timezone no backend (frontend é responsável por isso)
- Assumir que uma data está em um timezone específico
- Usar métodos como `getHours()`, `getDate()` sem considerar UTC
- Criar workarounds ou compatibilidade com padrões errados
- Hardcodar timezone específico no backend

## Implementação no Schema Prisma

Todos os campos `DateTime` devem ter `@db.Timestamptz`:

```prisma
model Appointment {
  startTime DateTime @db.Timestamptz @map("start_time")
  endTime   DateTime @db.Timestamptz @map("end_time")
  createdAt DateTime @default(now()) @db.Timestamptz @map("created_at")
  updatedAt DateTime @updatedAt @db.Timestamptz @map("updated_at")
  deletedAt DateTime? @db.Timestamptz @map("deleted_at")
}
```

## Implementação nos Services

### Recebendo Datas

Quando receber ISO strings do frontend:

```typescript
// ✅ CORRETO
const startDate = new Date(dto.startDate); // ISO string em UTC
// Date object já representa UTC internamente
```

### Trabalhando com Datas

Ao manipular datas, trabalhe com timestamps ou métodos UTC:

```typescript
// ✅ CORRETO - Usando timestamps
const endTime = new Date(startTime.getTime() + duration * 60000);

// ✅ CORRETO - Comparações diretas
if (startTime >= endTime) {
  // ...
}

// ✅ CORRETO - Retornando ISO string
return {
  startTime: appointment.startTime.toISOString(), // Retorna UTC
  endTime: appointment.endTime.toISOString(),
};
```

### ❌ Evitar

```typescript
// ❌ ERRADO - Usando métodos locais
const hours = date.getHours(); // Pode variar por timezone
const day = date.getDate(); // Pode variar por timezone

// ❌ ERRADO - Convertendo timezone no backend
const localDate = new Date(date.toLocaleString('pt-BR'));
```

## Validação nos DTOs

### Para campos de data/hora (DateTime)

```typescript
@ApiProperty({
  description: 'Data e hora de início do agendamento',
  example: '2024-01-21T10:00:00Z',
})
@IsNotEmpty()
@Type(() => Date)
@IsDate()
@MinDate(() => new Date(), {
  message: 'startTime must not be in the past',
})
startTime: Date;
```

### Para campos de data (Date only)

```typescript
@ApiProperty({ example: '2024-07-20T00:00:00Z' })
@IsDateString()
startDate: string; // ISO string em UTC
```

## Migration

A migration `20260122165933_refactor_all_datetime_to_timestamptz` converteu todos os campos `TIMESTAMP(3)` para `TIMESTAMPTZ` no PostgreSQL.

PostgreSQL converte automaticamente os valores existentes ao alterar o tipo, então não há risco de perda de dados.

## Testes

### Testes Funcionais

- [ ] Criar agendamento com horário específico
- [ ] Verificar no banco se está em UTC
- [ ] Criar período de ausência
- [ ] Criar assinatura com datas específicas
- [ ] Verificar se datas são salvas corretamente

### Testes de Timezone

- [ ] Testar com usuário em UTC-3 (Brasil)
- [ ] Testar com usuário em UTC+0 (Londres)
- [ ] Testar com usuário em UTC+9 (Tóquio)
- [ ] Verificar conversões frontend → backend → banco

## Referências

- [Prisma DateTime Types](https://www.prisma.io/docs/reference/api-reference/prisma-schema-reference#datetime)
- [PostgreSQL Timestamp Types](https://www.postgresql.org/docs/current/datatype-datetime.html)
- [NestJS Serialization](https://docs.nestjs.com/techniques/serialization)
- [ISO 8601 Standard](https://en.wikipedia.org/wiki/ISO_8601)

## Filtro de listagem (appointments)

Para a listagem de agendamentos, o frontend envia `startDate` e `endDate` na query. Quando o usuário escolhe "até dia X", o frontend envia `endDate` como **fim daquele dia em UTC** (ex.: `2025-01-31T23:59:59.999Z`) para que todos os agendamentos do dia X sejam incluídos. O backend recebe ISO em UTC e aplica `startTime.lte = endDate` no repositório.

## Notas Importantes

1. **Não há risco de perda de dados** - PostgreSQL converte automaticamente valores existentes ao alterar o tipo
2. **Prisma Client** precisa ser regenerado após mudanças no schema
3. **Backend nunca converte timezone** - sempre trabalha com UTC
4. **Frontend é responsável** por todas as conversões de timezone usando `date-fns-tz`
5. **ISO 8601 como padrão** - todas as comunicações usam ISO strings em UTC

---

**Última atualização**: 2025-01-22  
**Autor**: Equipe de Desenvolvimento  
**Status**: Implementado
