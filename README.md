# 💈 Barber Shop Manager - Sistema de Gerenciamento de Barbearias

Sistema backend desenvolvido em **NestJS** para gerenciamento completo de barbearias, incluindo agendamentos, clientes, funcionários, serviços, controle financeiro e integração com WhatsApp via Evolution API.

---

## 🚀 Tecnologias Utilizadas

- **NestJS** - Framework Node.js
- **Prisma** - ORM para banco de dados
- **PostgreSQL** - Banco de dados
- **TypeScript** - Linguagem de programação
- **JWT** - Autenticação
- **Swagger** - Documentação da API
- **Class Validator** - Validação de dados
- **Evolution API** - Integração com WhatsApp
- **Docker** - Containerização
- **Nginx** - Proxy reverso

---

## 📦 Instalação e Configuração

### 1. Clonar o repositório
```bash
git clone https://github.com/elvisea/barber_shop_manager_backend.git
cd barber_shop_manager_backend
```

### 2. Instalar dependências
```bash
npm install
```

### 3. Configurar variáveis de ambiente
```bash
cp .env.example .env
# Edite o arquivo .env com suas configurações
```

**Variáveis obrigatórias:**
```env
# Banco de dados
DATABASE_URL="postgresql://user:password@localhost:5432/barber_shop_manager"

# JWT
JWT_SECRET="your-jwt-secret"
JWT_REFRESH_SECRET="your-jwt-refresh-secret"

# Evolution API (WhatsApp)
EVOLUTION_API_URL="http://api:8080"
EVOLUTION_API_KEY="your-evolution-api-key"
WEBHOOK_URL="http://your-domain.com/api/webhook"

# AI Integration
GEMINI_API_KEY="your-gemini-api-key"
GEMINI_BASE_URL="https://generativelanguage.googleapis.com"
```

### 4. Configurar banco de dados
```bash
# Executar migrações
npx prisma migrate dev

# Popular banco com dados de exemplo
npx prisma db seed
```

### 5. Executar aplicação

#### Desenvolvimento
```bash
# Usando Docker Compose
docker-compose -f docker-compose.dev.yml up

# Ou localmente
npm run start:dev
```

#### Produção
```bash
# Usando Docker Compose
docker-compose up -d

# Ou localmente
npm run start:prod
```

---

## ✨ Guia de Boas Práticas e Estruturação

Este documento define o padrão estrutural e as boas práticas adotadas neste projeto backend utilizando **NestJS**.

---

## 📂 Estrutura Base por Módulos

Cada funcionalidade da aplicação deve ser organizada em **módulos isolados**, cada um com suas próprias camadas:

```
/src/modules/<nome-do-modulo>/
├── controllers/         # Entrada e saída HTTP
├── services/            # Regras de negócio  
├── repositories/        # Implementações de acesso a dados
├── dtos/                # Contratos de entrada/saída (validados)
├── contracts/           # Interfaces dos métodos de repositório
└── <module>.module.ts   # Configuração do módulo
```

**Observação**: Utilizamos os tipos gerados automaticamente pelo Prisma (`User`, `Establishment`, etc.) em vez de interfaces customizadas, evitando duplicação e mantendo sincronização automática com o schema do banco.

---

## 📅 Controller

Responsável por receber requisições HTTP, acionar o service e devolver a resposta.

* Deve usar DTOs validados com `class-validator`.
* Deve ser documentado com Swagger.
* Pode utilizar guards para autenticação/autorização.

### ✅ Exemplo:

```ts
@ApiTags('Estabelecimentos')
@ApiBearerAuth()
@Controller('establishments/:establishmentId/evolution-api')
@UseGuards(JwtAuthGuard)
export class EstablishmentEvolutionApiCreateInstanceController {
  constructor(private readonly evolutionApiService: EstablishmentEvolutionApiCreateInstanceService) {}

  @Post('instance')
  @ApiOperation({ summary: 'Criar nova instância na Evolution API' })
  @ApiResponse({ status: 201, type: EstablishmentEvolutionApiCreateInstanceResponseDTO })
  async handle(
    @GetRequestId() userId: string, // UUID como string
    @Param() params: EstablishmentParamDTO,
  ): Promise<EstablishmentEvolutionApiCreateInstanceResponseDTO> {
    return this.evolutionApiService.execute(params.establishmentId, userId);
  }
}
```

---

## 📂 DTOs (Contratos de Entrada)

Usados para validação dos dados recebidos pelos controllers, documentados com Swagger.

### ✅ Exemplo:

```ts
export class EstablishmentParamDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsString()
  @IsNotEmpty()
  establishmentId: string; // UUID como string
}
```

---

## 📄 DTOs de Saída (Response)

```ts
export class EstablishmentResponseDTO {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id: string; // UUID como string

  @ApiProperty({ example: 'Barbearia do João' })
  name: string;

  @ApiProperty({ example: '+5511999999999' })
  phone: string;

  @ApiProperty({ example: '2024-01-21T10:00:00Z' })
  createdAt: Date;

  @ApiProperty({ example: '2024-01-21T10:00:00Z' })
  updatedAt: Date;
}
```

---

## 🤖 Service

Contém a lógica de negócio. Deve:

* Validar regras antes de acionar o repositório.
* Usar `ErrorMessageService` e `CustomHttpException` para exceções.
* Registrar logs com `Logger` para acompanhamento.

### ⚠️ Exemplo:

```ts
@Injectable()
export class EstablishmentEvolutionApiCreateInstanceService {
  private readonly logger = new Logger(EstablishmentEvolutionApiCreateInstanceService.name);

  constructor(
    private readonly establishmentAccessService: EstablishmentAccessService,
    private readonly evolutionApiInstanceService: EvolutionApiInstanceService,
    private readonly evolutionApiWebhookService: EvolutionApiWebhookService,
  ) {}

  async execute(establishmentId: string, ownerId: string): Promise<ResponseDTO> {
    this.logger.log(`🔧 Iniciando criação de instância para estabelecimento: ${establishmentId}`);

    // Validar acesso
    const establishment = await this.establishmentAccessService.assertUserHasAccess(
      establishmentId,
      ownerId,
      true, // requireAdmin = true
    );

    // Criar instância
    const instanceResponse = await this.evolutionApiInstanceService.createInstance({
      instanceName: `establishment_${establishment.id}`,
      number: establishment.phone,
      qrcode: true,
      integration: 'WHATSAPP-BAILEYS',
    });

    // Configurar webhook
    try {
      await this.evolutionApiWebhookService.configureWebhook(instanceResponse.instance.instanceName);
    } catch (webhookError) {
      this.logger.warn(`⚠️ Webhook não configurado: ${webhookError.message}`);
    }

    return instanceResponse;
  }
}
```

---

## 📁 Repositórios

A camada de repositório é dividida em:

* `establishment-repository.interface.ts` (contratos)
* `establishment.repository.ts` (implementação)

### ✅ Interface:

```ts
export interface IEstablishmentRepository {
  findById(id: string): Promise<Establishment | null>; // UUID como string
  findByOwnerId(ownerId: string): Promise<Establishment[]>; // UUID como string
}
```

### ✅ Implementação:

```ts
@Injectable()
export class EstablishmentRepository implements IEstablishmentRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<Establishment | null> {
    return this.prismaService.establishment.findUnique({
      where: { id },
    });
  }
}
```

---

## 📊 Resumo das Regras

| Camada     | Entrada (contrato)    | Saída (contrato)     | Validação | Swagger |
| ---------- | --------------------- | -------------------- | --------- | ------- |
| Controller | DTO (class-validator) | DTO Response         | ✅         | ✅       |
| Service    | DTO Request           | DTO Response         | Opcional  | -       |
| Repository | Tipos Prisma          | Tipos Prisma         | -         | -       |

**Tipos utilizados:**
- **DTOs**: Para validação de entrada e contratos de saída da API
- **Tipos Prisma**: Gerados automaticamente (`User`, `Establishment`, etc.)
- **Interfaces de Contrato**: Apenas para definir métodos dos repositórios (`IUserRepository`)
- **UUIDs**: Todos os IDs são strings (UUIDs) em vez de números

---

## 🔧 Exceções Personalizadas

Utilizar sempre:

```ts
throw new CustomHttpException(
  this.errorMessageService.getMessage(ErrorCode.EXAMPLE, { KEY: value }),
  HttpStatus.CONFLICT,
  ErrorCode.EXAMPLE,
);
```

---

## 🗄️ Estrutura do Banco de Dados

O projeto utiliza **Prisma** como ORM com as seguintes entidades principais:

- **User** - Usuários do sistema (UUID)
- **Establishment** - Estabelecimentos/Barbearias (UUID)
- **EstablishmentMember** - Funcionários dos estabelecimentos (UUID)
- **EstablishmentCustomer** - Clientes dos estabelecimentos (UUID)
- **Service** - Serviços oferecidos (UUID)
- **Product** - Produtos vendidos (UUID)
- **Appointment** - Agendamentos (UUID)
- **Transaction** - Transações financeiras (UUID)
- **PaymentOrder** - Ordens de pagamento para funcionários (UUID)
- **Plan** - Planos de assinatura (UUID)
- **Subscription** - Assinaturas dos estabelecimentos (UUID)

---

## 🧪 Testes

```bash
# Testes unitários
npm run test

# Testes e2e
npm run test:e2e

# Cobertura de testes
npm run test:cov
```

---

## 📚 Documentação

### API Documentation
Após iniciar a aplicação, acesse:
- **Swagger UI**: `http://localhost:3000/api`
- **Redoc**: `http://localhost:3000/api-docs`

### 📁 Documentação Organizada

Toda a documentação do projeto está organizada na pasta `docs/` com a seguinte estrutura:

```
docs/
├── api/                          # Documentação da API
│   ├── import-to-postman.md
│   ├── README-routes-documentation.md
│   ├── routes.yaml
│   └── SUMMARY.md
├── development/                  # Guias de desenvolvimento
│   └── import-guidelines.md
├── implementation/               # Documentação de implementação
│   ├── members-module-implementation.md
│   └── user-email-verification-flow.md
├── refactoring/                 # Documentação de refatoração
│   └── members-module-refactoring.md
├── setup/                       # Guias de configuração
│   ├── github-actions-setup.md
│   ├── prisma-setup.md
│   └── production-environment.md
└── README.md                    # Índice principal
```

#### 🚀 Guias Rápidos
- **[Setup do Prisma](docs/setup/prisma-setup.md)** - Configuração completa do Prisma ORM
- **[Configuração de Produção](docs/setup/production-environment.md)** - Deploy e variáveis de ambiente
- **[GitHub Actions](docs/setup/github-actions-setup.md)** - CI/CD e secrets necessários
- **[Guidelines de Imports](docs/development/import-guidelines.md)** - Padrões de organização de código

#### 📋 Documentação Técnica
- **[Implementação do Módulo Members](docs/implementation/members-module-implementation.md)** - Guia completo de implementação
- **[Refatoração do Módulo Members](docs/refactoring/members-module-refactoring.md)** - Estratégia de refatoração paralela
- **[Fluxo de Verificação de Email](docs/implementation/user-email-verification-flow.md)** - Implementação de verificação

#### 📊 API Documentation
- **[Resumo da API](docs/api/SUMMARY.md)** - Estatísticas e visão geral
- **[Importar para Postman](docs/api/import-to-postman.md)** - Como usar a documentação
- **[routes.yaml](docs/api/routes.yaml)** - Documentação OpenAPI 3.0 completa

---

## 🌟 Funcionalidades Principais

### 🔐 Autenticação e Autorização
- ✅ **Autenticação JWT** com refresh tokens
- ✅ **Sistema de Roles** (ADMIN, BARBER, CUSTOMER)
- ✅ **Verificação de Email** para novos usuários

### 🏢 Gerenciamento de Estabelecimentos
- ✅ **Multi-tenant** com isolamento de dados
- ✅ **Cadastro de Funcionários** com diferentes roles
- ✅ **Gestão de Clientes** por estabelecimento
- ✅ **Horários de Funcionamento** configuráveis
- ✅ **Períodos de Fechamento** para feriados/férias

### 📅 Sistema de Agendamentos
- ✅ **Agendamentos completos** com validação de horários
- ✅ **Status de agendamento** (PENDING, CONFIRMED, CANCELLED, COMPLETED)
- ✅ **Múltiplos serviços** por agendamento

### 💰 Controle Financeiro
- ✅ **Transações** com diferentes métodos de pagamento
- ✅ **Sistema de Comissões** para funcionários
- ✅ **Ordens de Pagamento** para funcionários
- ✅ **Relatórios financeiros**

### 🤖 Integração com IA
- ✅ **Múltiplos provedores** (Gemini, DeepSeek)
- ✅ **Funções customizadas** para automação
- ✅ **Prompts especializados** para barbearias

### 📱 Integração WhatsApp (Evolution API)
- ✅ **Criação de instâncias** automática
- ✅ **Configuração de webhooks** para eventos
- ✅ **QR Code** para conexão
- ✅ **Recebimento de mensagens** via webhook
- ✅ **Automação de respostas** com IA

### 📋 Planos e Assinaturas
- ✅ **Sistema de planos** configuráveis
- ✅ **Assinaturas** por estabelecimento
- ✅ **Controle de acesso** baseado em planos

### 🔧 Infraestrutura
- ✅ **Docker** para containerização
- ✅ **Nginx** como proxy reverso
- ✅ **CI/CD** com GitHub Actions
- ✅ **Tratamento de Erros** centralizado
- ✅ **Logs estruturados** com Winston

---

## 🚀 Deploy

### Produção
```bash
# Build e deploy automático via GitHub Actions
git push origin main
```

### Desenvolvimento
```bash
# Usando Docker Compose
docker-compose -f docker-compose.dev.yml up -d
```

---

## 🤝 Contribuindo

Fique à vontade para duplicar essa estrutura para novos módulos. Em caso de dúvidas ou padrões não contemplados aqui, padronize de acordo com o que já foi feito no módulo de exemplo `establishments`.

### Padrões Importantes:
- ✅ **UUIDs**: Todos os IDs são strings (UUIDs)
- ✅ **Logs**: Sempre usar `Logger` para acompanhamento
- ✅ **Validação**: DTOs com `class-validator`
- ✅ **Documentação**: Swagger em todos os endpoints
- ✅ **Tratamento de Erros**: `CustomHttpException` centralizado

---

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

## 📞 Contato

Para dúvidas ou sugestões, entre em contato através dos issues do GitHub.
