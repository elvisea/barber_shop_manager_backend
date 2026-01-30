# Resumo das alterações no backend (para revisão e commits)

## Visão geral

- **Novo módulo `me`**: rotas `/me/*` para listar estabelecimentos, produtos, serviços, clientes e membros do usuário autenticado (owner ou member), com validação de acesso em uma única query.
- **Correção de validação**: `UserEstablishmentValidationService` passa a aceitar **owner** (Establishment.ownerId) além de **member** ativo.
- **Otimização**: `MeEstablishmentAccessService` usa uma única query ao banco (`findByIdWithUserAccess`) em vez de duas.
- **Limpeza de imports**: remoção de `PrismaModule` e `ErrorMessageModule` dos módulos que não precisam declará-los (são @Global e registrados no AppModule).
- **DTO**: `MeEstablishmentQueryDto` estende `BaseEstablishmentParamDTO`.
- **Docs**: `routes.yaml` regenerado com as novas rotas.

---

## 1. Novo módulo `me` (src/modules/me/)

### Estrutura
- **me.module.ts** – Importa Establishment, UserEstablishments, EstablishmentProducts, EstablishmentServices, EstablishmentCustomer (sem Prisma/ErrorMessage).
- **controllers/me.controller.ts** – `@Controller('me')`, `@UseGuards(JwtAuthGuard)`.
- **dtos/** – `MeIdNameDto` (`id`, `name`), `MeEstablishmentQueryDto` (estende `BaseEstablishmentParamDTO`).
- **services/** – MeEstablishmentAccessService, MeEstablishmentsService, MeProductsService, MeServicesService, MeCustomersService, MeMembersService.
- **docs/** – Swagger para cada rota.

### Rotas (GET, autenticadas)
| Rota | Query | Retorno |
|------|--------|----------|
| `GET /me/establishments` | - | `MeIdNameDto[]` (estabelecimentos do usuário: owner + member) |
| `GET /me/products` | `establishmentId` | `MeIdNameDto[]` |
| `GET /me/services` | `establishmentId` | `MeIdNameDto[]` |
| `GET /me/customers` | `establishmentId` | `MeIdNameDto[]` |
| `GET /me/members` | `establishmentId` | `MeIdNameDto[]` |

### Lógica de acesso
- **MeEstablishmentAccessService**: usa `EstablishmentRepository.findByIdWithUserAccess(establishmentId, userId)` (uma query com join em `user_establishments`). Se estabelecimento não existe → 404; se é owner ou member ativo → OK; senão → 403.
- Demais services `/me/*` chamam `assertUserHasAccessToEstablishment` e depois listam o recurso do estabelecimento.

---

## 2. Establishment (repositório)

- **contracts/establishment-repository.interface.ts** – Novo método `findByIdWithUserAccess(establishmentId, userId)` retornando `Establishment & { userEstablishments: Array<{ id: string; isActive: boolean }> } | null`.
- **repositories/establishment.repository.ts** – Implementação com `findFirst` + `include: { userEstablishments: { where: { userId, deletedAt: null }, take: 1, select: { id: true, isActive: true } } }`.

---

## 3. User-establishments (validação)

- **services/user-establishment-validation.service.ts** – `validateUserAccessToEstablishment`:
  - Antes: só considerava membro ativo (UserEstablishment); owner era rejeitado com "Estabelecimento não encontrado ou acesso negado".
  - Agora: busca em paralelo `establishment` e `userEstablishment`; se `establishment.ownerId === userId` → OK; se `userEstablishment?.isActive` → OK; senão → 403.

---

## 4. Remoção de imports globais

Módulos que **deixaram** de importar `PrismaModule` e/ou `ErrorMessageModule` (continuam globais via AppModule):

- **refresh-token.module.ts** – removido `PrismaModule`
- **user-establishments.module.ts** – removidos `ErrorMessageModule`, `PrismaModule`
- **tokens.module.ts** – removido `PrismaModule` (imports = [])
- **auth.module.ts** – removido `ErrorMessageModule`
- **email-service.module.ts** – removido `ErrorMessageModule` (incl. dentro de `MailerModule.forRootAsync`)
- **ai.module.ts** – removido `ErrorMessageModule`

---

## 5. App e documentação

- **app.module.ts** – Adicionado `MeModule` aos imports.
- **docs/api/routes.yaml** – Regenerado (`npm run docs:generate`) com as rotas `/me/*`.

---

## Sugestão de grupos para commits

1. **feat(me): add Me module with /me/establishments, products, services, customers, members**  
   - Todo `src/modules/me/`, `src/app.module.ts`, `src/modules/establishment` (interface + repository `findByIdWithUserAccess`).

2. **fix(user-establishments): allow owner and member in validateUserAccessToEstablishment**  
   - `src/modules/user-establishments/services/user-establishment-validation.service.ts`.

3. **chore(modules): remove redundant PrismaModule and ErrorMessageModule imports**  
   - refresh-token, user-establishments, tokens, auth, email-service, ai.

4. **docs(api): regenerate routes.yaml**  
   - `docs/api/routes.yaml`.

(Se preferir um único commit de feature: pode juntar 1 e 2 como `feat(me): add Me module and fix establishment access validation` e manter 3 e 4 separados.)
