# Regras de Negócio e Fluxo de Criação

## Fluxo Principal de Criação

### 1. Criação de Usuário (User)

**Endpoint**: `POST /users`

**Regras**:
- Não requer autenticação
- Email deve ser único no sistema
- CPF/documento é criptografado (AES-256-GCM)
- Senha é hasheada antes de salvar
- Usuário criado com `emailVerified = false`
- Token de verificação é gerado e enviado por email (expira em 15 minutos)
- Se email já existe mas não está verificado, novo token é enviado
- Se email já existe e está verificado, retorna erro de conflito

**Próximos Passos**:
- Usuário deve verificar email antes de fazer login
- Após verificação, pode criar estabelecimentos

---

### 2. Verificação de Email

**Endpoint**: `POST /users/email-verification/verify`

**Regras**:
- Token deve ser válido e não expirado
- Token só pode ser usado uma vez
- Após verificação, `emailVerified = true`
- Usuário pode fazer login após verificação

**Reenvio de Token**:
- `POST /users/email-verification/resend`
- Gera novo token se email não estiver verificado

---

### 3. Autenticação

**Endpoint**: `POST /user-auth/login`

**Regras**:
- Email deve estar verificado (`emailVerified = true`)
- Senha deve estar correta
- Retorna `accessToken` e `refreshToken`
- RefreshToken é salvo no banco com informações do dispositivo

**Tokens**:
- AccessToken: Curta duração (configurável)
- RefreshToken: Longa duração, armazenado no banco

---

### 4. Criação de Estabelecimento

**Endpoint**: `POST /establishments`

**Regras**:
- Requer autenticação (JWT)
- Requer role `OWNER`
- Telefone deve ser único por usuário (considerando soft delete)
- Estabelecimento vinculado ao `ownerId` do usuário autenticado
- Estabelecimento criado com soft delete habilitado

**Próximos Passos**:
- Após criar estabelecimento, pode adicionar membros
- Pode criar produtos e serviços
- Pode configurar horários de funcionamento

---

### 5. Adição de Membros ao Estabelecimento

**Endpoint**: `POST /establishments/:establishmentId/members`

**Regras**:
- Requer autenticação
- Usuário deve ser dono do estabelecimento (`ownerId`)
- Email e telefone devem ser únicos no sistema
- Cria novo `User` + `UserEstablishment`
- Gera senha temporária (8 caracteres)
- Envia email com senha temporária
- Cria token de verificação de email (expira em 15 minutos)
- Role do membro é definido na criação (BARBER, HAIRDRESSER, RECEPTIONIST)

**UserEstablishment**:
- Vincula usuário ao estabelecimento
- Define role do usuário no estabelecimento
- `isActive = true` por padrão

---

### 6. Produtos e Serviços do Estabelecimento

**Produtos**:
- `POST /establishments/:establishmentId/products`
- Nome deve ser único por estabelecimento
- Preço e comissão são definidos (comissão em Decimal 5,4)
- Estoque é gerenciado

**Serviços**:
- `POST /establishments/:establishmentId/services`
- Nome deve ser único por estabelecimento
- Preço, comissão e duração são definidos
- Duração em minutos

**Regras**:
- Requer autenticação
- Usuário deve ter acesso ao estabelecimento
- Produtos/serviços são padrão do estabelecimento

---

### 7. Personalização por Usuário

**Produtos Personalizados**:
- `POST /members/:memberId/products/:productId`
- Usuário pode ter preço e comissão personalizados
- Herda do produto base do estabelecimento
- Unique: (userId, establishmentId, productId)

**Serviços Personalizados**:
- `POST /members/:memberId/services/:serviceId`
- Usuário pode ter preço, comissão e duração personalizados
- Herda do serviço base do estabelecimento
- Unique: (userId, establishmentId, serviceId)

**Regras**:
- Requer autenticação
- Usuário deve ter acesso ao estabelecimento
- Personalização é opcional (usa padrão se não existir)

---

### 8. Clientes

**Endpoint**: `POST /establishments/:establishmentId/customers`

**Regras**:
- Requer autenticação
- Email e telefone devem ser únicos por estabelecimento
- Cliente vinculado ao estabelecimento
- Cliente pode ter múltiplos agendamentos

---

### 9. Agendamentos

**Endpoint**: `POST /establishments/:establishmentId/appointments`

**Regras**:
- Requer autenticação
- Requer role `OWNER` ou `ROOT`
- Cliente deve existir no estabelecimento
- Usuário (funcionário) deve ser membro do estabelecimento
- Pode conter múltiplos serviços (AppointmentService)
- `startTime` e `endTime` são calculados baseados nos serviços
- `totalAmount` e `totalDuration` são calculados
- Status padrão: `PENDING`

**AppointmentService**:
- Vincula serviços ao agendamento
- Armazena preço, duração e comissão no momento do agendamento
- Unique: (appointmentId, serviceId)

**Status do Agendamento**:
- `PENDING`: Agendado, aguardando confirmação
- `CONFIRMED`: Confirmado pelo cliente
- `COMPLETED`: Serviço realizado
- `CANCELLED`: Cancelado
- `NO_SHOW`: Cliente não compareceu

---

### 10. Transações

**Criação**:
- Pode ser criada a partir de um agendamento
- Pode ser criada diretamente (sem agendamento)
- Uma transação pode ter apenas um agendamento (1:1 opcional)

**Regras**:
- `totalAmount`: Soma dos itens
- `discount`: Desconto aplicado (padrão 0)
- `finalAmount`: totalAmount - discount
- `commissionAmount`: Soma das comissões dos itens
- `paymentMethod`: Forma de pagamento
- `paymentStatus`: Status do pagamento

**TransactionItem**:
- Pode ser produto ou serviço (`itemType`)
- Armazena preço unitário, quantidade, preço total e comissão
- Vinculado a `EstablishmentProduct` ou `EstablishmentService`

**Status de Pagamento**:
- `PENDING`: Aguardando pagamento
- `PAID`: Pago
- `FAILED`: Falhou
- `REFUNDED`: Reembolsado

---

### 11. Ordens de Pagamento

**Endpoint**: `POST /payment-orders` (implícito)

**Regras**:
- Criada para pagar comissões a funcionários
- Define período (periodStart, periodEnd)
- Calcula total de comissões do período
- Status e método de pagamento são definidos
- Vinculada ao usuário (funcionário) e estabelecimento

---

## Validações e Regras de Acesso

### Autenticação
- Maioria dos endpoints requer `JwtAuthGuard`
- Token Bearer no header `Authorization: Bearer <token>`

### Autorização por Role
- `OWNER`: Dono do estabelecimento
- `ROOT`: Usuário root/admin
- `RECEPTIONIST`: Recepcionista
- `HAIRDRESSER`: Cabeleireiro
- `BARBER`: Barbeiro

### Validações de Propriedade
- Usuário só pode acessar estabelecimentos que é dono ou membro
- Validação de `ownerId` em operações sensíveis
- Validação de `establishmentId` em recursos do estabelecimento

### Soft Delete
- Todas as exclusões são lógicas (`deletedAt`, `deletedBy`)
- Recursos deletados não aparecem em listagens
- Constraints de unicidade consideram soft delete

### Timezone
- Usuários podem configurar timezone preferido
- Frontend detecta automaticamente se não configurado
- Datas são armazenadas em UTC no banco

---

## Fluxo Completo de Uso

1. **Usuário se cadastra** → `POST /users`
2. **Verifica email** → `POST /users/email-verification/verify`
3. **Faz login** → `POST /user-auth/login`
4. **Cria estabelecimento** → `POST /establishments`
5. **Adiciona membros** → `POST /establishments/:id/members`
6. **Cria produtos/serviços** → `POST /establishments/:id/products` e `/services`
7. **Personaliza produtos/serviços** (opcional) → `POST /members/:memberId/products/:productId` ou `POST /members/:memberId/services/:serviceId`
8. **Cadastra clientes** → `POST /establishments/:id/customers`
9. **Cria agendamentos** → `POST /establishments/:id/appointments`
10. **Finaliza agendamento** → Atualiza status para `COMPLETED`
11. **Cria transação** → Vinculada ao agendamento ou diretamente
12. **Processa pagamento** → Atualiza `paymentStatus` para `PAID`
13. **Gera ordem de pagamento** → Para pagar comissões aos funcionários

---

## Observações Importantes

1. **Refatoração**: Sistema migrou de `Member` separado para `User` unificado com `UserEstablishment`
2. **Módulo Legado**: Módulo `members` ainda existe mas está sendo substituído por `user-establishments`
3. **Criptografia**: CPF/documento é criptografado (AES-256-GCM)
4. **Tokens**: Tokens de verificação expiram em 15 minutos
5. **Comissões**: Armazenadas como Decimal(5,4) - permite até 99.9999%
6. **Multi-tenant**: Sistema suporta múltiplos estabelecimentos por usuário
7. **Soft Delete**: Todas as exclusões são lógicas para auditoria
