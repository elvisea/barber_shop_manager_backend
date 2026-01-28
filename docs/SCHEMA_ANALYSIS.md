# Análise do Schema Prisma e Relacionamentos

## Visão Geral da Refatoração

A aplicação passou por uma grande refatoração que unificou os modelos `Member` e `User` em um único modelo `User`, com a relação `UserEstablishment` para vincular usuários a estabelecimentos.

## Modelos e Relacionamentos

### Core Models

#### User
- **Propósito**: Representa todos os usuários do sistema (donos, funcionários, etc.)
- **Relacionamentos**:
  - `ownedEstablishments`: Estabelecimentos que o usuário é dono (1:N)
  - `userEstablishments`: Relações com estabelecimentos (1:N via UserEstablishment)
  - `appointments`: Agendamentos realizados pelo usuário (1:N)
  - `transactions`: Transações realizadas pelo usuário (1:N)
  - `paymentOrders`: Ordens de pagamento (2 relações: criadas por e para o usuário)
  - `userProducts`: Produtos personalizados do usuário (1:N)
  - `userServices`: Serviços personalizados do usuário (1:N)
  - `workingHours`: Horários de trabalho (1:N)
  - `absencePeriods`: Períodos de ausência (1:N)
  - `refreshTokens`: Tokens de refresh (1:N)
  - `tokens`: Tokens genéricos (1:N)
  - `createdSubscriptions`: Assinaturas criadas pelo usuário (1:N)

#### Establishment
- **Propósito**: Representa estabelecimentos/barbearias
- **Relacionamentos**:
  - `owner`: Dono do estabelecimento (N:1 com User via ownerId)
  - `userEstablishments`: Membros do estabelecimento (1:N via UserEstablishment)
  - `customers`: Clientes do estabelecimento (1:N)
  - `products`: Produtos do estabelecimento (1:N)
  - `services`: Serviços do estabelecimento (1:N)
  - `appointments`: Agendamentos do estabelecimento (1:N)
  - `openingHours`: Horários de funcionamento (1:N)
  - `closurePeriods`: Períodos de fechamento (1:N)
  - `subscriptions`: Assinaturas do estabelecimento (1:N)

### User Establishment Models

#### UserEstablishment
- **Propósito**: Tabela pivô que relaciona usuários com estabelecimentos
- **Campos importantes**:
  - `role`: Papel do usuário no estabelecimento (UserRole)
  - `isActive`: Se o membro está ativo
- **Relacionamentos**:
  - `user`: Usuário (N:1)
  - `establishment`: Estabelecimento (N:1)
- **Unique**: (userId, establishmentId)

#### UserWorkingHours
- **Propósito**: Horários de trabalho dos usuários
- **Relacionamentos**:
  - `user`: Usuário (N:1)
- **Unique**: (userId, dayOfWeek)

#### UserAbsencePeriod
- **Propósito**: Períodos de ausência dos usuários
- **Relacionamentos**:
  - `user`: Usuário (N:1)

### Customers

#### EstablishmentCustomer
- **Propósito**: Clientes dos estabelecimentos
- **Relacionamentos**:
  - `establishment`: Estabelecimento (N:1)
  - `appointments`: Agendamentos do cliente (1:N)
  - `transactions`: Transações do cliente (1:N)
- **Unique**: (establishmentId, email) e (establishmentId, phone)

### Products & Services

#### EstablishmentProduct
- **Propósito**: Produtos padrão do estabelecimento
- **Relacionamentos**:
  - `establishment`: Estabelecimento (N:1)
  - `userProducts`: Personalizações por usuário (1:N)
  - `transactionItems`: Itens de transação (1:N)
- **Unique**: (establishmentId, name)

#### EstablishmentService
- **Propósito**: Serviços padrão do estabelecimento
- **Relacionamentos**:
  - `establishment`: Estabelecimento (N:1)
  - `userServices`: Personalizações por usuário (1:N)
  - `appointmentServices`: Serviços em agendamentos (1:N)
  - `transactionItems`: Itens de transação (1:N)
- **Unique**: (establishmentId, name)

#### UserProduct
- **Propósito**: Personalização de produtos por usuário
- **Relacionamentos**:
  - `user`: Usuário (N:1)
  - `product`: Produto base (N:1)
- **Unique**: (userId, establishmentId, productId)

#### UserService
- **Propósito**: Personalização de serviços por usuário
- **Relacionamentos**:
  - `user`: Usuário (N:1)
  - `service`: Serviço base (N:1)
- **Unique**: (userId, establishmentId, serviceId)

### Appointments

#### Appointment
- **Propósito**: Agendamentos de clientes
- **Relacionamentos**:
  - `customer`: Cliente (N:1)
  - `user`: Funcionário que atende (N:1)
  - `establishment`: Estabelecimento (N:1)
  - `services`: Serviços do agendamento (1:N via AppointmentService)
  - `transaction`: Transação relacionada (1:1 opcional)

#### AppointmentService
- **Propósito**: Serviços realizados em um agendamento
- **Relacionamentos**:
  - `appointment`: Agendamento (N:1)
  - `service`: Serviço (N:1)
- **Unique**: (appointmentId, serviceId)

### Transactions

#### Transaction
- **Propósito**: Transações financeiras
- **Relacionamentos**:
  - `appointment`: Agendamento relacionado (1:1 opcional)
  - `customer`: Cliente (N:1)
  - `user`: Funcionário (N:1)
  - `items`: Itens da transação (1:N)
- **Unique**: appointmentId (uma transação por agendamento)

#### TransactionItem
- **Propósito**: Itens de uma transação (produtos ou serviços)
- **Relacionamentos**:
  - `transaction`: Transação (N:1)
  - `product`: Produto (N:1 opcional)
  - `service`: Serviço (N:1 opcional)

#### PaymentOrder
- **Propósito**: Ordens de pagamento para funcionários
- **Relacionamentos**:
  - `user`: Usuário que recebe o pagamento (N:1)
  - `createdBy`: Usuário que criou a ordem (N:1)

### Subscriptions

#### Plan
- **Propósito**: Planos de assinatura disponíveis
- **Relacionamentos**:
  - `subscriptions`: Assinaturas do plano (1:N)

#### Subscription
- **Propósito**: Assinaturas de planos por estabelecimentos
- **Relacionamentos**:
  - `establishment`: Estabelecimento (N:1)
  - `plan`: Plano (N:1)
  - `createdBy`: Usuário que criou (N:1 opcional)

### Authentication

#### RefreshToken
- **Propósito**: Refresh tokens para autenticação
- **Relacionamentos**:
  - `user`: Usuário (N:1)

#### Token
- **Propósito**: Tokens genéricos (verificação de email, reset de senha, etc.)
- **Relacionamentos**:
  - `user`: Usuário (N:1)
- **Tipos**: EMAIL_VERIFICATION, PASSWORD_RESET, WHATSAPP_VERIFICATION, OTP

### Configuration

#### OpeningHours
- **Propósito**: Horários de funcionamento dos estabelecimentos
- **Relacionamentos**:
  - `establishment`: Estabelecimento (N:1)
- **Unique**: (establishmentId, dayOfWeek)

#### ClosurePeriod
- **Propósito**: Períodos de fechamento dos estabelecimentos
- **Relacionamentos**:
  - `establishment`: Estabelecimento (N:1)

## Enums

### UserRole
- `OWNER`: Dono do estabelecimento
- `ROOT`: Usuário root/admin
- `RECEPTIONIST`: Recepcionista
- `HAIRDRESSER`: Cabeleireiro
- `BARBER`: Barbeiro

### AppointmentStatus
- `PENDING`: Pendente
- `CONFIRMED`: Confirmado
- `COMPLETED`: Completo
- `CANCELLED`: Cancelado
- `NO_SHOW`: Cliente não compareceu

### PaymentStatus
- `PENDING`: Pendente
- `PAID`: Pago
- `FAILED`: Falhou
- `REFUNDED`: Reembolsado

### PaymentMethod
- `CASH`: Dinheiro
- `CREDIT_CARD`: Cartão de crédito
- `DEBIT_CARD`: Cartão de débito
- `PIX`: PIX
- `OTHER`: Outro

### ItemType
- `PRODUCT`: Produto
- `SERVICE`: Serviço

### SubscriptionStatus
- `ACTIVE`: Ativo
- `EXPIRED`: Expirado
- `CANCELLED`: Cancelado
- `PENDING`: Pendente

### TokenType
- `EMAIL_VERIFICATION`: Verificação de email
- `PASSWORD_RESET`: Reset de senha
- `WHATSAPP_VERIFICATION`: Verificação WhatsApp
- `OTP`: One-time password

## Características Importantes

### Soft Delete
Todas as tabelas principais possuem:
- `deletedAt`: Data de exclusão lógica
- `deletedBy`: ID do usuário que realizou a exclusão

### Timezone
- Usuários podem ter `timezone` configurado (IANA timezone string)
- Se não configurado, frontend detecta automaticamente

### Criptografia
- Campo `document` (CPF) é criptografado usando AES-256-GCM

### Verificação de Email
- Tokens de verificação expiram em 15 minutos
- Status controlado por `emailVerified` no User

## Fluxo de Dados

1. **Criação de Usuário** → User criado com email não verificado
2. **Verificação de Email** → Token criado, email verificado
3. **Autenticação** → AccessToken e RefreshToken gerados
4. **Criação de Estabelecimento** → Establishment criado, vinculado ao ownerId
5. **Adição de Membros** → User + UserEstablishment criados
6. **Produtos/Serviços** → EstablishmentProduct/Service criados
7. **Personalização** → UserProduct/UserService criados (opcional)
8. **Clientes** → EstablishmentCustomer criado
9. **Agendamentos** → Appointment criado com AppointmentServices
10. **Transações** → Transaction criada com TransactionItems
11. **Pagamentos** → PaymentOrder criada para funcionários
