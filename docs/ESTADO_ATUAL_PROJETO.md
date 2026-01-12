# Análise do Estado Atual - Barber Shop Manager Backend

## Visão Geral do Projeto

O projeto é um sistema backend desenvolvido em **NestJS** para gerenciamento completo de barbearias. Utiliza:

- **Prisma ORM** com PostgreSQL
- **JWT** para autenticação
- **Swagger** para documentação da API
- **Evolution API** para integração WhatsApp
- **IA (Gemini/DeepSeek)** para automação de respostas
- **Docker** para containerização

## Estrutura de Módulos

O projeto segue arquitetura modular com padrão:

```
modules/<nome-modulo>/
├── controllers/    # Endpoints HTTP
├── services/       # Regras de negócio
├── repositories/   # Acesso a dados
├── dtos/          # Contratos de entrada/saída
├── contracts/     # Interfaces de repositório
└── <module>.module.ts
```

## Módulos e CRUDs Implementados

### 1. Autenticação (`auth`)

**Endpoints:**

- `POST /user-auth/login` - Login de usuários (OWNER/ROOT)

**Funcionalidades:**

- Autenticação JWT com refresh tokens
- Validação de credenciais
- Geração de tokens de acesso e refresh

### 2. Usuários (`user`)

**CRUD Completo:**

- `POST /users` - Criar usuário
- Validação de email único
- Hash de senha com bcryptjs
- Roles: OWNER, ROOT

### 3. Verificação de Email de Usuários (`user-email-verification`)

**Endpoints:**

- `POST /user-email-verification/verify` - Verificar email
- `POST /user-email-verification/resend` - Reenviar código

**Regras:**

- Token com expiração de 24h
- Envio de email automático
- Validação de token único

### 4. Estabelecimentos (`establishment`)

**CRUD Completo:**

- `POST /establishments` - Criar estabelecimento
- `GET /establishments` - Listar estabelecimentos (do dono)
- `GET /establishments/:id` - Buscar por ID
- `PUT /establishments/:id` - Atualizar estabelecimento
- `DELETE /establishments/:id` - Excluir (soft delete)

**Endpoints Especiais:**

- `POST /establishments/:establishmentId/evolution-api/instance` - Criar instância WhatsApp

**Regras de Negócio:**

- Validação de acesso: apenas dono pode gerenciar
- Soft delete com `deletedAt` e `isDeleted`
- Telefone único por dono
- Integração automática com Evolution API

### 5. Membros/Funcionários (`members`)

**CRUD Completo:**

- `POST /establishments/:establishmentId/members` - Criar membro
- `GET /establishments/:establishmentId/members` - Listar membros
- `GET /establishments/:establishmentId/members/:memberId` - Buscar por ID
- `PUT /establishments/:establishmentId/members/:memberId` - Atualizar
- `DELETE /establishments/:establishmentId/members/:memberId` - Excluir

**Regras de Negócio:**

- Validação de acesso: apenas dono do estabelecimento
- Email e telefone únicos globalmente
- Geração de senha temporária automática
- Envio de email de boas-vindas com código de verificação
- Roles: RECEPTIONIST, HAIRDRESSER, BARBER
- Soft delete implementado

### 6. Autenticação de Membros (`member-auth`)

**Endpoints:**

- `POST /member-auth/login` - Login de membros

**Funcionalidades:**

- JWT específico para membros
- Refresh tokens para membros
- Validação de email verificado

### 7. Verificação de Email de Membros (`member-email-verification`)

**Endpoints:**

- `POST /member-email-verification/verify` - Verificar email
- `POST /member-email-verification/resend` - Reenviar código

### 8. Clientes (`establishment-customers`)

**CRUD Completo:**

- `POST /establishments/:establishmentId/customers` - Criar cliente
- `GET /establishments/:establishmentId/customers` - Listar clientes
- `GET /establishments/:establishmentId/customers/:customerId` - Buscar por ID
- `PUT /establishments/:establishmentId/customers/:customerId` - Atualizar
- `DELETE /establishments/:establishmentId/customers/:customerId` - Excluir

**Regras de Negócio:**

- Email e telefone únicos por estabelecimento
- Validação de acesso ao estabelecimento
- Soft delete

### 9. Serviços do Estabelecimento (`establishment-services`)

**CRUD Completo:**

- `POST /establishments/:establishmentId/services` - Criar serviço
- `GET /establishments/:establishmentId/services` - Listar serviços
- `GET /establishments/:establishmentId/services/:serviceId` - Buscar por ID
- `PUT /establishments/:establishmentId/services/:serviceId` - Atualizar
- `DELETE /establishments/:establishmentId/services/:serviceId` - Excluir

**Regras de Negócio:**

- Nome único por estabelecimento
- Campos: nome, descrição, duração (minutos), preço, comissão (Decimal 5,4)
- Soft delete

### 10. Produtos do Estabelecimento (`establishment-products`)

**CRUD Completo:**

- `POST /establishments/:establishmentId/products` - Criar produto
- `GET /establishments/:establishmentId/products` - Listar produtos
- `GET /establishments/:establishmentId/products/:productId` - Buscar por ID
- `PUT /establishments/:establishmentId/products/:productId` - Atualizar
- `DELETE /establishments/:establishmentId/products/:productId` - Excluir

**Regras de Negócio:**

- Nome único por estabelecimento
- Campos: nome, descrição, preço, comissão, estoque
- Soft delete

### 11. Serviços Personalizados por Membro (`member-services`)

**Endpoints:**

- `POST /establishments/:establishmentId/members/:memberId/services` - Criar serviço personalizado
- `GET /establishments/:establishmentId/members/:memberId/services` - Listar serviços do membro

**Regras de Negócio:**

- Permite que cada membro tenha preço/comissão/duração personalizados
- Validação: membro deve existir no estabelecimento
- Validação: serviço deve existir no estabelecimento
- Único por membro+estabelecimento+serviço

### 12. Produtos Personalizados por Membro (`member-products`)

**Endpoints:**

- `POST /establishments/:establishmentId/members/:memberId/products` - Criar produto personalizado

**Regras de Negócio:**

- Permite que cada membro tenha preço/comissão personalizados
- Validação similar a member-services

### 13. Agendamentos (`appointments`)

**CRUD Completo:**

- `POST /establishments/:establishmentId/appointments` - Criar agendamento
- `GET /establishments/:establishmentId/appointments` - Listar agendamentos (com paginação)
- `GET /establishments/:establishmentId/appointments/:appointmentId` - Buscar por ID
- `PUT /establishments/:establishmentId/appointments/:appointmentId` - Atualizar
- `DELETE /establishments/:establishmentId/appointments/:appointmentId` - Excluir

**Regras de Negócio Complexas:**

1. Validação de acesso: dono OU membro do estabelecimento pode criar
2. Validação de cliente: deve existir no estabelecimento
3. Validação de membro: deve existir no estabelecimento
4. Validação de serviços: devem existir no estabelecimento
5. Validação de serviços permitidos: membro deve ter permissão para os serviços
6. Cálculo automático: totalAmount, totalDuration, endTime baseado nos serviços
7. Validação de conflito de horários: não pode haver sobreposição para o mesmo membro
8. Validação de range de tempo: startTime < endTime
9. Status: PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW
10. Múltiplos serviços por agendamento
11. Soft delete

### 14. Planos (`plans`)

**CRUD Completo:**

- `POST /plans` - Criar plano
- `GET /plans` - Listar planos
- `GET /plans/:planId` - Buscar por ID
- `PUT /plans/:planId` - Atualizar plano
- `DELETE /plans/:planId` - Excluir plano

**Regras de Negócio:**

- Campos: nome, descrição, preço, duração (dias), isActive
- Soft delete

### 15. Assinaturas (`subscriptions`)

**CRUD Completo:**

- `POST /subscriptions` - Criar assinatura
- `GET /subscriptions` - Listar assinaturas
- `GET /subscriptions/:subscriptionId` - Buscar por ID
- `PUT /subscriptions/:subscriptionId` - Atualizar assinatura
- `DELETE /subscriptions/:subscriptionId` - Excluir assinatura

**Regras de Negócio:**

- Vinculação: estabelecimento + plano
- Status: ACTIVE, EXPIRED, CANCELLED, PENDING
- Campos: startDate, endDate, paid (boolean), phone
- Soft delete

### 16. Refresh Tokens (`refresh-token`)

**Funcionalidades:**

- Gerenciamento de refresh tokens para usuários
- Revogação de tokens
- Rastreamento de userAgent e IP

### 17. Webhook (`webhook`)

**Endpoints:**

- `POST /webhook` - Receber eventos da Evolution API

**Funcionalidades:**

- Recebimento de mensagens WhatsApp
- Processamento de eventos (chats, messages)
- Integração com IA para respostas automáticas
- Sistema de buffer/debounce (10s de inatividade)
- Histórico de conversas

### 18. IA (`ai`)

**Funcionalidades:**

- Function Calling com múltiplos provedores (Gemini, DeepSeek)
- Tools disponíveis:
  - `get_plans` - Listar planos disponíveis
  - `create_plan` - Criar novo plano
- Sistema de registro centralizado de tools
- Prompts especializados para barbearias
- Integração com WhatsApp via webhook

## Entidades do Banco de Dados (Prisma Schema)

### Core Models

- **User** - Usuários do sistema (OWNER, ROOT)
- **Establishment** - Estabelecimentos/Barbearias
- **RefreshToken** - Tokens de refresh para usuários

### Members Models

- **Member** - Funcionários dos estabelecimentos
- **MemberRefreshToken** - Tokens de refresh para membros
- **MemberWorkingHours** - Horários de trabalho dos membros
- **MemberAbsencePeriod** - Períodos de ausência dos membros

### Customers Models

- **EstablishmentCustomer** - Clientes dos estabelecimentos

### Products & Services Models

- **EstablishmentProduct** - Produtos dos estabelecimentos
- **EstablishmentService** - Serviços dos estabelecimentos
- **MemberProduct** - Produtos personalizados por membro
- **MemberService** - Serviços personalizados por membro

### Appointments Models

- **Appointment** - Agendamentos de clientes
- **AppointmentService** - Serviços realizados em um agendamento

### Transactions Models

- **Transaction** - Transações financeiras
- **TransactionItem** - Itens de uma transação (produtos/serviços)
- **PaymentOrder** - Ordens de pagamento para funcionários

### Subscriptions Models

- **Plan** - Planos de assinatura disponíveis
- **Subscription** - Assinaturas de planos por estabelecimentos

### Email Verification Models

- **UserEmailVerification** - Verificação de email de usuários
- **MemberEmailVerification** - Verificação de email de membros

### Configuration Models

- **OpeningHours** - Horários de funcionamento dos estabelecimentos
- **ClosurePeriod** - Períodos de fechamento dos estabelecimentos

## Enums

- **UserRole**: OWNER, ROOT
- **MemberRole**: RECEPTIONIST, HAIRDRESSER, BARBER
- **AppointmentStatus**: PENDING, CONFIRMED, COMPLETED, CANCELLED, NO_SHOW
- **PaymentStatus**: PENDING, PAID, FAILED, REFUNDED
- **PaymentMethod**: CASH, CREDIT_CARD, DEBIT_CARD, PIX, OTHER
- **ItemType**: PRODUCT, SERVICE
- **SubscriptionStatus**: ACTIVE, EXPIRED, CANCELLED, PENDING

## Regras de Negócio Principais

### Soft Delete

Todos os modelos principais implementam soft delete com:

- `deletedAt` (DateTime?)
- `deletedBy` (String?)
- `isDeleted` (Boolean, default: false)
- Índices para otimização de consultas

### Validação de Acesso

- Estabelecimentos: apenas dono pode gerenciar
- Membros: apenas dono pode criar/atualizar/excluir
- Agendamentos: dono OU membro do estabelecimento pode criar

### Validações de Unicidade

- Email de usuário: único globalmente
- Email de membro: único globalmente
- Telefone de membro: único globalmente
- Telefone de estabelecimento: único por dono
- Email/telefone de cliente: único por estabelecimento
- Nome de serviço/produto: único por estabelecimento

### Sistema de Comissões

- Produtos e serviços têm campo `commission` (Decimal 5,4)
- Membros podem ter comissões personalizadas por produto/serviço
- Cálculo automático em transações

### Agendamentos

- Validação de conflito de horários por membro
- Cálculo automático de duração total e valor total
- Validação de serviços permitidos ao membro
- Múltiplos serviços por agendamento

## Funcionalidades Especiais

### Integração WhatsApp (Evolution API)

- Criação automática de instâncias por estabelecimento
- Configuração de webhooks
- QR Code para conexão
- Recebimento de mensagens via webhook
- Automação de respostas com IA

### Sistema de IA

- Function Calling para automação
- Múltiplos provedores (Gemini, DeepSeek)
- Tools registradas centralmente
- Buffer/debounce para evitar respostas fragmentadas
- Histórico de conversas para contexto

### Sistema de Email

- Envio de emails de verificação
- Templates de boas-vindas
- Códigos de verificação com expiração

## Infraestrutura

### Docker

- `docker-compose.yml` para produção
- `docker-compose.dev.yml` para desenvolvimento
- Nginx como proxy reverso

### CI/CD

- GitHub Actions configurado
- Pipeline automático de deploy

### Documentação

- Swagger UI em `/api/docs`
- Redoc em `/api-docs`
- Documentação YAML gerada automaticamente
- Scripts npm para geração de docs

## Estatísticas

- **52 controllers** implementados
- **25 rotas** documentadas no Swagger
- **48 schemas** completos
- **18 módulos** principais
- **20+ entidades** no banco de dados
- **62 códigos de erro** padronizados

## Funcionalidades Pendentes/Incompletas

### Transações Financeiras

- Modelo `Transaction` existe no schema
- Modelo `PaymentOrder` existe no schema
- **Não há controllers/services implementados** para estas funcionalidades

### Horários de Funcionamento

- Modelo `OpeningHours` existe no schema
- **Não há controllers/services implementados**

### Períodos de Fechamento

- Modelo `ClosurePeriod` existe no schema
- **Não há controllers/services implementados**

### Horários de Trabalho dos Membros

- Modelo `MemberWorkingHours` existe no schema
- **Não há controllers/services implementados**

### Períodos de Ausência dos Membros

- Modelo `MemberAbsencePeriod` existe no schema
- **Não há controllers/services implementados**

## Conclusão

O projeto está bem estruturado e com a maioria das funcionalidades core implementadas. Os principais CRUDs estão completos, com validações robustas e regras de negócio bem definidas. As integrações com WhatsApp e IA estão funcionais.

**Pontos fortes:**

- Arquitetura modular bem organizada
- Soft delete implementado consistentemente
- Validações de acesso robustas
- Sistema de agendamentos completo
- Integração com IA funcional

**Áreas que precisam de desenvolvimento:**

- Módulo de transações financeiras
- Gestão de horários (estabelecimento e membros)
- Gestão de períodos de fechamento/ausência
- Sistema de comissões completo (cálculo e pagamento)
