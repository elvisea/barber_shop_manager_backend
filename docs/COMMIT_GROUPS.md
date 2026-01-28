# Agrupamento de Commits para Refatoração User/Member

## Estratégia de Commits

Seguindo o padrão Conventional Commits, os arquivos foram agrupados por funcionalidade relacionada.

## Grupo 1: Schema e Migration (CRÍTICO - PRIMEIRO)

**Tipo:** `refactor(database)`

**Arquivos:**
- `prisma/schema.prisma`
- `prisma/migrations/20260127002308_init/migration.sql` (deletado)
- `prisma/migrations/20260128020225_init_unified_user/migration.sql` (novo)

**Mensagem sugerida:**
```
refactor(database): unifica User e Member em estrutura única

- Remove model Member e MemberRefreshToken
- Cria model UserEstablishment para relacionamento User-Establishment
- Renomeia Member* para User* (WorkingHours, AbsencePeriod, Product, Service)
- Atualiza relacionamentos para usar User diretamente
- Cria migration inicial com estrutura unificada
```

## Grupo 2: Seeds

**Tipo:** `refactor(seeds)`

**Arquivos:**
- `prisma/seeds/data/members.ts`
- `prisma/seeds/index.ts`
- `prisma/seeds/utils/validation.ts`

**Mensagem sugerida:**
```
refactor(seeds): atualiza seeds para estrutura unificada User/Member

- Atualiza criação de membros para criar User + UserEstablishment
- Ajusta validações para nova estrutura
```

## Grupo 3: Módulo User-Establishments (NOVO)

**Tipo:** `feat(user-establishments)`

**Arquivos:**
- `src/modules/user-establishments/**/*` (todos os arquivos do novo módulo)

**Mensagem sugerida:**
```
feat(user-establishments): adiciona módulo para gerenciar relacionamentos User-Establishment

- Cria controllers para CRUD de user-establishments
- Implementa services de validação e criação
- Adiciona DTOs e documentação Swagger
- Suporta verificação de email e resumo de relacionamentos
```

## Grupo 4: Remoção do Módulo Member-Auth

**Tipo:** `refactor(auth)`

**Arquivos:**
- `src/modules/member-auth/**/*` (todos deletados)

**Mensagem sugerida:**
```
refactor(auth): remove módulo member-auth após unificação

- Remove autenticação separada para membros
- Autenticação agora é unificada através do módulo auth principal
```

## Grupo 5: Atualização do Módulo Appointments

**Tipo:** `refactor(appointments)`

**Arquivos:**
- `src/modules/appointments/**/*` (todos os arquivos modificados)

**Mensagem sugerida:**
```
refactor(appointments): atualiza relacionamentos para usar User

- Substitui referências a Member por User
- Atualiza DTOs para usar userId em vez de memberId
- Ajusta repositories e services para nova estrutura
```

## Grupo 6: Atualização do Módulo Members

**Tipo:** `refactor(members)`

**Arquivos:**
- `src/modules/members/**/*` (todos os arquivos modificados)

**Mensagem sugerida:**
```
refactor(members): atualiza módulo para trabalhar com User através de UserEstablishment

- Repository agora cria User + UserEstablishment
- Services atualizados para nova estrutura
- Mantém compatibilidade com API existente
```

## Grupo 7: Atualização Member-Products e Member-Services

**Tipo:** `refactor(member-products,member-services)`

**Arquivos:**
- `src/modules/member-products/**/*`
- `src/modules/member-services/**/*`

**Mensagem sugerida:**
```
refactor(member-products,member-services): atualiza para usar User

- Relacionamentos atualizados de Member para User
- Mappers e validators ajustados
- Mantém estrutura de pastas (renomeação lógica)
```

## Grupo 8: Atualização do Módulo Tokens

**Tipo:** `refactor(tokens)`

**Arquivos:**
- `src/modules/tokens/**/*`

**Mensagem sugerida:**
```
refactor(tokens): unifica sistema de tokens para User

- Remove distinção entre user tokens e member tokens
- Services atualizados para trabalhar apenas com User
```

## Grupo 9: Atualização do Módulo Auth

**Tipo:** `refactor(auth)`

**Arquivos:**
- `src/modules/auth/interfaces/jwt-payload.interface.ts`

**Mensagem sugerida:**
```
refactor(auth): atualiza JWT payload para estrutura unificada

- Payload agora reflete estrutura User unificada
```

## Grupo 10: Atualização de Interfaces e Configuração

**Tipo:** `refactor(core)`

**Arquivos:**
- `src/common/interfaces/authenticated-user.interface.ts`
- `src/app.module.ts`
- `src/modules/establishment/**/*` (arquivos modificados)
- `src/modules/establishment-customers/**/*` (arquivos modificados)

**Mensagem sugerida:**
```
refactor(core): atualiza interfaces e configuração para estrutura unificada

- Interface AuthenticatedUser atualizada
- AppModule ajustado para novos/removidos módulos
- Repositories de establishment atualizados
```

## Grupo 11: Documentação

**Tipo:** `docs`

**Arquivos:**
- `docs/api/routes.yaml`
- `docs/REFACTORING_SUMMARY.md` (novo)
- `docs/COMMIT_GROUPS.md` (novo)
- Outros arquivos de documentação novos

**Mensagem sugerida:**
```
docs: atualiza documentação para refatoração User/Member

- Atualiza routes.yaml com novas rotas
- Adiciona resumo da refatoração
- Documenta agrupamento de commits
```

## Grupo 12: Dependências

**Tipo:** `chore`

**Arquivos:**
- `package-lock.json`

**Mensagem sugerida:**
```
chore: atualiza dependências após refatoração
```

## Ordem Recomendada de Commits

1. Schema e Migration (CRÍTICO - deve ser primeiro)
2. Seeds
3. Módulo User-Establishments
4. Remoção Member-Auth
5. Atualização Appointments
6. Atualização Members
7. Atualização Member-Products/Services
8. Atualização Tokens
9. Atualização Auth
10. Interfaces e Configuração
11. Documentação
12. Dependências

## Comandos Git

```bash
# Grupo 1: Schema e Migration
git add prisma/schema.prisma prisma/migrations/
git commit -m "refactor(database): unifica User e Member em estrutura única"

# Grupo 2: Seeds
git add prisma/seeds/
git commit -m "refactor(seeds): atualiza seeds para estrutura unificada User/Member"

# Grupo 3: User-Establishments
git add src/modules/user-establishments/
git commit -m "feat(user-establishments): adiciona módulo para gerenciar relacionamentos User-Establishment"

# Grupo 4: Remoção Member-Auth
git add src/modules/member-auth/
git commit -m "refactor(auth): remove módulo member-auth após unificação"

# Grupo 5: Appointments
git add src/modules/appointments/
git commit -m "refactor(appointments): atualiza relacionamentos para usar User"

# Grupo 6: Members
git add src/modules/members/
git commit -m "refactor(members): atualiza módulo para trabalhar com User através de UserEstablishment"

# Grupo 7: Member-Products/Services
git add src/modules/member-products/ src/modules/member-services/
git commit -m "refactor(member-products,member-services): atualiza para usar User"

# Grupo 8: Tokens
git add src/modules/tokens/
git commit -m "refactor(tokens): unifica sistema de tokens para User"

# Grupo 9: Auth
git add src/modules/auth/
git commit -m "refactor(auth): atualiza JWT payload para estrutura unificada"

# Grupo 10: Core
git add src/common/ src/app.module.ts src/modules/establishment/ src/modules/establishment-customers/
git commit -m "refactor(core): atualiza interfaces e configuração para estrutura unificada"

# Grupo 11: Documentação
git add docs/
git commit -m "docs: atualiza documentação para refatoração User/Member"

# Grupo 12: Dependências
git add package-lock.json
git commit -m "chore: atualiza dependências após refatoração"
```
