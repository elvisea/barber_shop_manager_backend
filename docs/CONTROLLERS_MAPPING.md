# Mapeamento Completo de Controllers

## Resumo

- **Total de Controllers**: 70
- **Controllers com Documentação**: 67
- **Controllers sem Documentação**: 3 (subscriptions - não implementados)

## Controllers por Módulo

### Authentication (4 controllers)
1. `POST /user-auth/login` - Autenticação de usuário
2. `POST /auth/password-reset` - Solicitar reset de senha
3. `POST /auth/password-reset/verify` - Validar token de reset
4. `POST /auth/password-reset/confirm` - Confirmar reset de senha

### Users (3 controllers)
1. `POST /users` - Criar usuário
2. `POST /users/email-verification/resend` - Reenviar verificação
3. `POST /users/email-verification/verify` - Verificar email

### Establishments (6 controllers)
1. `POST /establishments` - Criar estabelecimento
2. `GET /establishments` - Listar estabelecimentos
3. `GET /establishments/:establishmentId` - Buscar estabelecimento
4. `PATCH /establishments/:establishmentId` - Atualizar estabelecimento
5. `DELETE /establishments/:establishmentId` - Deletar estabelecimento
6. `POST /establishments/:establishmentId/evolution-api/instance` - Criar instância Evolution API

### Establishment Members (User Establishments) (8 controllers)
1. `POST /establishments/:establishmentId/members` - Adicionar membro
2. `GET /establishments/:establishmentId/members` - Listar membros
3. `GET /members/:memberId` - Buscar membro
4. `PATCH /members/:memberId` - Atualizar membro
5. `DELETE /members/:memberId` - Deletar membro
6. `GET /members/:memberId/summary` - Resumo do membro
7. `POST /members/email-verification/resend` - Reenviar verificação
8. `POST /members/email-verification/verify` - Verificar email

### Members (Legado) (8 controllers)
1. `POST /establishments/:establishmentId/members` - Criar membro (legado)
2. `GET /establishments/:establishmentId/members` - Listar membros (legado)
3. `GET /members/:memberId` - Buscar membro (legado)
4. `PATCH /members/:memberId` - Atualizar membro (legado)
5. `DELETE /members/:memberId` - Deletar membro (legado)
6. `GET /members/:memberId/summary` - Resumo do membro (legado)
7. `POST /members/email-verification/resend` - Reenviar verificação (legado)
8. `POST /members/email-verification/verify` - Verificar email (legado)

### Establishment Customers (5 controllers)
1. `POST /establishments/:establishmentId/customers` - Criar cliente
2. `GET /establishments/:establishmentId/customers` - Listar clientes
3. `GET /customers/:customerId` - Buscar cliente
4. `PATCH /customers/:customerId` - Atualizar cliente
5. `DELETE /customers/:customerId` - Deletar cliente

### Establishment Products (5 controllers)
1. `POST /establishments/:establishmentId/products` - Criar produto
2. `GET /establishments/:establishmentId/products` - Listar produtos
3. `GET /products/:productId` - Buscar produto
4. `PATCH /products/:productId` - Atualizar produto
5. `DELETE /products/:productId` - Deletar produto

### Establishment Services (5 controllers)
1. `POST /establishments/:establishmentId/services` - Criar serviço
2. `GET /establishments/:establishmentId/services` - Listar serviços
3. `GET /services/:serviceId` - Buscar serviço
4. `PATCH /services/:serviceId` - Atualizar serviço
5. `DELETE /services/:serviceId` - Deletar serviço

### Member Products (5 controllers)
1. `POST /members/:memberId/products/:productId` - Criar produto personalizado
2. `GET /members/:memberId/products` - Listar produtos personalizados
3. `GET /members/:memberId/products/:productId` - Buscar produto personalizado
4. `PATCH /members/:memberId/products/:productId` - Atualizar produto personalizado
5. `DELETE /members/:memberId/products/:productId` - Deletar produto personalizado

### Member Services (5 controllers)
1. `POST /members/:memberId/services/:serviceId` - Criar serviço personalizado
2. `GET /members/:memberId/services` - Listar serviços personalizados
3. `GET /members/:memberId/services/:serviceId` - Buscar serviço personalizado
4. `PATCH /members/:memberId/services/:serviceId` - Atualizar serviço personalizado
5. `DELETE /members/:memberId/services/:serviceId` - Deletar serviço personalizado

### Appointments (5 controllers)
1. `POST /establishments/:establishmentId/appointments` - Criar agendamento
2. `GET /establishments/:establishmentId/appointments` - Listar agendamentos
3. `GET /establishments/:establishmentId/appointments/:appointmentId` - Buscar agendamento
4. `PUT /establishments/:establishmentId/appointments/:appointmentId` - Atualizar agendamento
5. `DELETE /establishments/:establishmentId/appointments/:appointmentId` - Deletar agendamento

### Plans (5 controllers)
1. `POST /plans` - Criar plano
2. `GET /plans` - Listar planos
3. `GET /plans/:id` - Buscar plano
4. `PATCH /plans/:id` - Atualizar plano
5. `DELETE /plans/:id` - Deletar plano

### Subscriptions (5 controllers - 4 não implementados)
1. `POST /establishments/:establishmentId/subscriptions` - Criar assinatura
2. `GET /subscriptions` - Listar assinaturas (não implementado)
3. `GET /subscriptions/:id` - Buscar assinatura (não implementado)
4. `PATCH /subscriptions/:id` - Atualizar assinatura (não implementado)
5. `DELETE /subscriptions/:id` - Deletar assinatura (não implementado)

### Webhook (1 controller)
1. `POST /api/webhook` - Receber webhook

## Controllers sem Documentação

Os seguintes controllers não possuem implementação completa:

1. `src/modules/subscriptions/controllers/subscription-find-all.controller.ts` - Vazio
2. `src/modules/subscriptions/controllers/subscription-find-by-id.controller.ts` - Vazio
3. `src/modules/subscriptions/controllers/subscription-update.controller.ts` - Vazio
4. `src/modules/subscriptions/controllers/subscription-delete.controller.ts` - Vazio

## Autenticação e Autorização

### Endpoints Públicos (sem autenticação)
- `POST /users` - Criar usuário
- `POST /users/email-verification/*` - Verificação de email
- `POST /user-auth/login` - Login
- `POST /auth/password-reset/*` - Reset de senha
- `POST /members/email-verification/*` - Verificação de email de membros
- `GET /plans` - Listar planos (público)
- `POST /api/webhook` - Webhook

### Endpoints com JWT Auth
A maioria dos endpoints requer `JwtAuthGuard` e alguns também requerem `RolesGuard` com roles específicas.

### Endpoints com Bearer Auth
Endpoints marcados com `@ApiBearerAuth()` requerem token Bearer no header.

## Observações

1. **Duplicação**: Existem controllers duplicados entre `members` (legado) e `user-establishments` (novo). O módulo `members` parece estar em processo de depreciação.

2. **Rotas Inconsistentes**: Alguns controllers usam rotas diferentes para o mesmo recurso:
   - Membros: `/members/:memberId` vs `/establishments/:establishmentId/members`
   - Produtos: `/products/:productId` vs `/establishments/:establishmentId/products`
   - Serviços: `/services/:serviceId` vs `/establishments/:establishmentId/services`

3. **Documentação**: A maioria dos controllers possui documentação Swagger através de decorators `@*Docs()`.
