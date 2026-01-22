# Análise do Estado Atual - Barber Shop Manager Backend

## Atualizações Recentes (Janeiro 2026)

### Commits de 22/01/2026

- **feat: implementa datas dinâmicas nas documentações e DTOs** - Melhoria na documentação com exemplos dinâmicos de datas
- **chore: adiciona dependência @nestjs/event-emitter** - Adicionado suporte para sistema de eventos
- **refactor: resolve dependência circular usando relações do Prisma** - Correção de dependências circulares
- **feat: implementa sistema de eventos para envio de emails** - Sistema de eventos para comunicação assíncrona
- **fix: resolver conflito de exportação getErrorMessage** - Correção de conflitos de exportação
- **refactor: criar funções utilitárias para extração de mensagens de erro** - Melhoria na organização de código
- **fix(lint): substitui require() por import ES6 para body-parser** - Atualização para ES6 modules
- **fix(lint): adiciona tipagem explícita em decoradores Transform e ValidateIf** - Melhorias de tipagem
- **fix(lint): remove async desnecessário de métodos sem await** - Otimizações de código
- **chore(lint): corrige variáveis não usadas e configura ESLint** - Configuração de linting
- **chore(deps): atualiza package-lock.json com peer dependencies** - Atualização de dependências
- **docs(docker): adiciona comentário sobre porta do PostgreSQL** - Melhorias na documentação
- **fix(auth): usa UTC para cálculo de expiração de refresh tokens** - Correção de timezone
- **refactor(prisma): remove isDeleted redundante e consolida migrations** - Otimização do schema

### Melhorias Implementadas

- Sistema de eventos para envio de emails assíncrono
- Melhorias na documentação com exemplos dinâmicos
- Correções de timezone para UTC em tokens
- Otimizações de código e linting
- Resolução de dependências circulares

## Visão Geral do Projeto

O projeto é um sistema backend desenvolvido em **NestJS** para gerenciamento completo de barbearias. Utiliza:

- **Prisma ORM** com PostgreSQL
- **JWT** para autenticação
- **Swagger** para documentação da API
- **Evolution API** para integração WhatsApp
- **IA (Gemini/DeepSeek)** para automação de respostas
- **Docker** para containerização

## API Pronta para Frontend

Esta seção lista todos os endpoints disponíveis organizados por tipo de autenticação e permissões, facilitando o desenvolvimento do frontend.

### Autenticação de Usuários (Owners)

#### Endpoints Públicos (Não requerem autenticação)

- `POST /users` - Criar conta de usuário (OWNER/ROOT)
- `POST /user-auth/login` - Login de usuário (retorna JWT + refresh token)
- `GET /user-email-verification/verify?email=...&code=...` - Verificar email do usuário
- `POST /user-email-verification/resend` - Reenviar código de verificação

#### Endpoints Protegidos (Requerem JWT de User - Bearer Token)

**Estabelecimentos:**
- `POST /establishments` - Criar estabelecimento (apenas OWNER)
- `GET /establishments` - Listar estabelecimentos do usuário autenticado
- `GET /establishments/:id` - Buscar estabelecimento por ID
- `PUT /establishments/:id` - Atualizar estabelecimento
- `DELETE /establishments/:id` - Excluir estabelecimento (soft delete)
- `POST /establishments/:establishmentId/evolution-api/instance` - Criar instância WhatsApp

**Membros/Funcionários:**
- `POST /establishments/:establishmentId/members` - Criar membro/funcionário
- `GET /establishments/:establishmentId/members` - Listar membros do estabelecimento
- `GET /establishments/:establishmentId/members/:memberId` - Buscar membro por ID
- `PUT /establishments/:establishmentId/members/:memberId` - Atualizar membro
- `DELETE /establishments/:establishmentId/members/:memberId` - Excluir membro

**Clientes:**
- `POST /establishments/:establishmentId/customers` - Criar cliente
- `GET /establishments/:establishmentId/customers` - Listar clientes
- `GET /establishments/:establishmentId/customers/:customerId` - Buscar cliente por ID
- `PUT /establishments/:establishmentId/customers/:customerId` - Atualizar cliente
- `DELETE /establishments/:establishmentId/customers/:customerId` - Excluir cliente

**Serviços:**
- `POST /establishments/:establishmentId/services` - Criar serviço
- `GET /establishments/:establishmentId/services` - Listar serviços
- `GET /establishments/:establishmentId/services/:serviceId` - Buscar serviço por ID
- `PUT /establishments/:establishmentId/services/:serviceId` - Atualizar serviço
- `DELETE /establishments/:establishmentId/services/:serviceId` - Excluir serviço

**Produtos:**
- `POST /establishments/:establishmentId/products` - Criar produto
- `GET /establishments/:establishmentId/products` - Listar produtos
- `GET /establishments/:establishmentId/products/:productId` - Buscar produto por ID
- `PUT /establishments/:establishmentId/products/:productId` - Atualizar produto
- `DELETE /establishments/:establishmentId/products/:productId` - Excluir produto

**Serviços Personalizados por Membro:**
- `POST /establishments/:establishmentId/members/:memberId/services` - Criar serviço personalizado
- `GET /establishments/:establishmentId/members/:memberId/services` - Listar serviços do membro

**Produtos Personalizados por Membro:**
- `POST /establishments/:establishmentId/members/:memberId/products` - Criar produto personalizado

**Agendamentos:**
- `POST /establishments/:establishmentId/appointments` - Criar agendamento (OWNER ou ROOT)
- `GET /establishments/:establishmentId/appointments` - Listar agendamentos (com paginação)
- `GET /establishments/:establishmentId/appointments/:appointmentId` - Buscar agendamento por ID
- `PUT /establishments/:establishmentId/appointments/:appointmentId` - Atualizar agendamento
- `DELETE /establishments/:establishmentId/appointments/:appointmentId` - Excluir agendamento

**Planos:**
- `POST /plans` - Criar plano
- `GET /plans` - Listar planos
- `GET /plans/:planId` - Buscar plano por ID
- `PUT /plans/:planId` - Atualizar plano
- `DELETE /plans/:planId` - Excluir plano

**Assinaturas:**
- `POST /subscriptions` - Criar assinatura
- `GET /subscriptions` - Listar assinaturas
- `GET /subscriptions/:subscriptionId` - Buscar assinatura por ID
- `PUT /subscriptions/:subscriptionId` - Atualizar assinatura
- `DELETE /subscriptions/:subscriptionId` - Excluir assinatura

### Autenticação de Membros (Funcionários)

#### Endpoints Públicos (Não requerem autenticação)

- `POST /member-auth/login` - Login de membro/funcionário (retorna JWT + refresh token)
- `GET /member-email-verification/verify?email=...&code=...` - Verificar email do membro
- `POST /member-email-verification/resend` - Reenviar código de verificação

#### Endpoints Protegidos (Requerem JWT de Member - Bearer Token)

**Nota:** Atualmente, os membros autenticados podem acessar os mesmos endpoints que os owners, mas a validação de acesso é feita no service. O sistema verifica se o membro pertence ao estabelecimento antes de permitir operações.

**Endpoints disponíveis para membros:**
- Todos os endpoints de agendamentos (criar, listar, buscar, atualizar, excluir)
- Endpoints de visualização (listar clientes, serviços, produtos)
- A validação de acesso é feita internamente verificando se o membro pertence ao estabelecimento

**Limitações:**
- Membros não podem criar/editar/excluir estabelecimentos
- Membros não podem gerenciar outros membros
- Membros podem criar agendamentos (validação no service permite isso)

### Webhook (Público - Evolution API)

- `POST /webhook` - Receber eventos da Evolution API (WhatsApp)

## Permissões por Tipo de Usuário

### UserRole.OWNER

Usuários com role OWNER podem:

- **Gerenciar Estabelecimentos:**
  - Criar, listar, atualizar e excluir estabelecimentos
  - Configurar integração WhatsApp (Evolution API)
  - Visualizar todos os dados do estabelecimento

- **Gerenciar Membros/Funcionários:**
  - Criar, listar, atualizar e excluir membros
  - Definir roles dos membros (RECEPTIONIST, HAIRDRESSER, BARBER)
  - Gerenciar serviços e produtos personalizados por membro

- **Gerenciar Clientes:**
  - CRUD completo de clientes do estabelecimento
  - Visualizar histórico de agendamentos por cliente

- **Gerenciar Serviços e Produtos:**
  - CRUD completo de serviços e produtos
  - Definir preços, comissões e duração
  - Gerenciar estoque de produtos

- **Gerenciar Agendamentos:**
  - Criar, listar, atualizar e excluir agendamentos
  - Visualizar todos os agendamentos do estabelecimento
  - Gerenciar status dos agendamentos

- **Gerenciar Planos e Assinaturas:**
  - CRUD completo de planos
  - Criar e gerenciar assinaturas
  - Visualizar status de assinaturas

### UserRole.ROOT

Usuários com role ROOT têm:

- **Todas as permissões de OWNER**
- Permissão adicional para criar agendamentos (além de OWNER)
- Acesso administrativo completo ao sistema

### MemberRole.RECEPTIONIST

Funcionários com role RECEPTIONIST podem:

- **Visualizar Dados:**
  - Listar clientes do estabelecimento
  - Listar serviços e produtos disponíveis
  - Visualizar agendamentos

- **Gerenciar Agendamentos:**
  - Criar agendamentos (validação no service)
  - Atualizar agendamentos existentes
  - Visualizar histórico de agendamentos

- **Limitações:**
  - Não pode criar/editar estabelecimentos
  - Não pode gerenciar membros
  - Não pode criar/editar serviços e produtos
  - Não pode gerenciar planos e assinaturas

### MemberRole.HAIRDRESSER / BARBER

Funcionários com roles HAIRDRESSER ou BARBER podem:

- **Visualizar Dados:**
  - Listar clientes do estabelecimento
  - Listar serviços e produtos disponíveis
  - Visualizar seus próprios agendamentos

- **Gerenciar Agendamentos:**
  - Criar agendamentos (validação no service)
  - Atualizar agendamentos atribuídos a eles
  - Visualizar histórico de seus agendamentos

- **Serviços Personalizados:**
  - Visualizar serviços personalizados configurados para eles
  - (Futuro: poderão atualizar seus próprios preços/comissões)

- **Limitações:**
  - Não pode criar/editar estabelecimentos
  - Não pode gerenciar membros
  - Não pode criar/editar serviços e produtos gerais
  - Não pode gerenciar planos e assinaturas
  - Acesso limitado aos dados do estabelecimento

## Observações Importantes para o Frontend

1. **Autenticação:**
   - Usuários (OWNER/ROOT) usam `/user-auth/login`
   - Membros (funcionários) usam `/member-auth/login`
   - Ambos retornam JWT tokens que devem ser enviados no header `Authorization: Bearer <token>`

2. **Validação de Acesso:**
   - A maioria dos endpoints usa apenas `JwtAuthGuard` sem `RolesGuard`
   - A validação de acesso é feita nos services, verificando se o usuário/membro pertence ao estabelecimento
   - Apenas 2 endpoints usam `@Roles()` explicitamente:
     - `POST /establishments` (apenas OWNER)
     - `POST /establishments/:establishmentId/appointments` (OWNER ou ROOT)

3. **Soft Delete:**
   - Todos os endpoints de exclusão fazem soft delete (não removem do banco)
   - Registros excluídos têm `deletedAt` preenchido e `isDeleted = true`

4. **Paginação:**
   - Endpoints de listagem podem ter paginação (verificar documentação Swagger)
   - Agendamentos têm paginação implementada

5. **Validações:**
   - Todos os DTOs são validados com `class-validator`
   - Erros de validação retornam status 400 com detalhes
   - Códigos de erro padronizados (ErrorCode enum)

6. **Timezones:**
   - Todas as datas são armazenadas em UTC no banco
   - Frontend deve converter para timezone do usuário
   - Usuários podem ter timezone preferido configurado

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
