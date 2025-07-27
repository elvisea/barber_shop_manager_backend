# 🔗 Evolution API Integration

Integração com a Evolution API para criação de instâncias do WhatsApp por estabelecimento.

## 📋 Funcionalidades

- ✅ **Criar Instâncias**: Criação de novas instâncias na Evolution API
- ✅ **Validação de Acesso**: Verifica se o usuário tem acesso ao estabelecimento
- ✅ **Validação de Role**: Requer role ADMIN no estabelecimento
- ✅ **Integração Segura**: Comunicação segura com a Evolution API
- ✅ **Logs Detalhados**: Rastreamento completo das operações
- ✅ **Rota Padronizada**: Segue o padrão da Evolution API (`/instance`)
- ✅ **Resposta Completa**: Retorna todos os dados da Evolution API
- ✅ **QR Code no Terminal**: Impressão automática do QR Code para conexão

## 🚀 Endpoints

### POST `/establishments/:establishmentId/evolution-api/instance`

Cria uma nova instância na Evolution API para um estabelecimento específico e configura automaticamente o webhook.

**Fluxo Completo:**
1. **Validação**: Verifica se o usuário é ADMIN do estabelecimento
2. **Criação da Instância**: Cria instância na Evolution API
3. **Configuração do Webhook**: Configura webhook automaticamente para receber eventos
4. **QR Code**: Retorna QR Code para conexão do WhatsApp

**URL Parameters**:
- `establishmentId`: UUID do estabelecimento

**Request Body**: Não requer body (establishmentId vem da URL)

**Response**:
```json
{
  "instance": {
    "instanceName": "establishment_123",
    "instanceId": "4dce8cb1-f9b6-4275-9879-b43de412c621",
    "integration": "WHATSAPP-BAILEYS",
    "webhookWaBusiness": null,
    "accessTokenWaBusiness": "",
    "status": "connecting"
  },
  "hash": "ACC0F39E-3A30-4CE3-83F3-B2D86E3E776B",
  "webhook": {},
  "websocket": {},
  "rabbitmq": {},
  "nats": {},
  "sqs": {},
  "settings": {
    "rejectCall": false,
    "msgCall": "",
    "groupsIgnore": false,
    "alwaysOnline": false,
    "readMessages": false,
    "readStatus": false,
    "syncFullHistory": false,
    "wavoipToken": ""
  },
  "qrcode": {
    "pairingCode": null,
    "code": "2@/2itoIvUhIMoATNJ9/aG0qinw8ily+EypWfkp/4SaRRf7c0OynASby43iae1cxi8t/jWL7/mXtIHX/1eMDRt1U/1N+jOVCax/uw=,Lacn0MS3LYHLShv+wytezZy8KNwJjwyPqVRUggs+lSU=,AXmzz0JmgUbYgD4N2pUUiiblHbJwU1aZuTxzmHyC2nU=,rVmoSimFKzwhSkDx733dyAjcfoF/HcYEokDIm6VzHEM=",
    "base64": "data:image/png;base64,Lacn0MS3LYHLShv+....",
    "count": 1
  }
}
```

## 🔗 Webhook Automático

### 📡 **Configuração Automática**

Quando uma instância é criada, o webhook é configurado automaticamente com:

- **URL**: `https://barbershopmanagerapi.bytefulcode.tech/webhook/evolution/{establishmentId}`
- **Eventos**: Todos os eventos principais do WhatsApp
- **Headers**: Autenticação com Bearer Token

### 📋 **Eventos Configurados**

```json
[
  "APPLICATION_STARTUP",
  "QRCODE_UPDATED",
  "MESSAGES_SET",
  "MESSAGES_UPSERT",
  "MESSAGES_UPDATE",
  "MESSAGES_DELETE",
  "SEND_MESSAGE",
  "CONTACTS_SET",
  "CONTACTS_UPSERT",
  "CONTACTS_UPDATE",
  "PRESENCE_UPDATE",
  "CHATS_SET",
  "CHATS_UPSERT",
  "CHATS_UPDATE",
  "CHATS_DELETE",
  "GROUPS_UPSERT",
  "GROUP_UPDATE",
  "GROUP_PARTICIPANTS_UPDATE",
  "CONNECTION_UPDATE",
  "LABELS_EDIT",
  "LABELS_ASSOCIATION",
  "CALL",
  "TYPEBOT_START",
  "TYPEBOT_CHANGE_STATUS"
]
```

### ⚙️ **Variáveis de Ambiente**

```env
WEBHOOK_BASE_URL=https://barbershopmanagerapi.bytefulcode.tech
EVOLUTION_API_KEY=your_api_key_here
EVOLUTION_API_URL=http://localhost:8080
```

### 🔄 **Tratamento de Erros**

- Se a criação da instância falhar, a operação é cancelada
- Se a configuração do webhook falhar, a instância é criada mas o webhook não é configurado
- Logs detalhados são gerados para cada etapa do processo

## �� QR Code e Conexão

### 📱 **Sobre o QR Code**

O QR Code retornado pela Evolution API é usado para conectar o WhatsApp à instância criada:

- **`qrcode.code`**: Código de autenticação usado para gerar o QR Code no terminal (tamanho adequado)
- **`qrcode.base64`**: Imagem do QR Code em formato base64 para exibição em interfaces web (muito grande para terminal)
- **`instance.status`**: Status da instância (`connecting`, `connected`, `disconnected`)

### 🖥️ **Impressão no Terminal**

Quando uma instância é criada com sucesso, o QR Code é automaticamente impresso no terminal usando a biblioteca `qrcode-terminal`:

**Nota**: Utilizamos o campo `qrcode.code` (código de autenticação) em vez de `qrcode.base64` (imagem) porque o base64 é muito grande e causaria overflow no terminal.

```bash
📱 [EVOLUTION-API] QR Code gerado! Escaneie com o WhatsApp:
==================================================
█████████████████████████████████████████████████████████████
████ ▄▄▄▄▄ █▀█ █▄█▄█ ▄▄▄▄▄ ████
████ █   █ █▀▀▀█ ▀▄█ █   █ ████
████ █ █ █ █▀ █▀▀▄█ █ █ █ ████
████▄▄▄▄▄▄▄█▄▀ █▄█▄█▄▄▄▄▄▄▄████
████▄▄  ▄▀▄▄ ▄▀▄▀▀▄▄▄▀▄▄▄▀▄▄▄████
████▀▄▄▄▀▄▄▄▀▄▄▄▀▄▄▄▀▄▄▄▀▄▄▄████
████▄▄▄▄▄▄▄█▄▀ █▄█▄█▄▄▄▄▄▄▄████
████ █   █ █▀▀▀█ ▀▄█ █   █ ████
████ █ █ █ █▀ █▀▀▄█ █ █ █ ████
████ █   █ █▀▀▀█ ▀▄█ █   █ ████
████▄▄▄▄▄▄▄█▄▀ █▄█▄█▄▄▄▄▄▄▄████
█████████████████████████████████████████████████████████████
📱 [EVOLUTION-API] QR Code impresso no terminal acima!
📱 [EVOLUTION-API] Status da instância: connecting
📱 [EVOLUTION-API] ID da instância: 4dce8cb1-f9b6-4275-9879-b43de412c621
==================================================
```

**Biblioteca Utilizada**: `qrcode-terminal` (compatível com containers Docker)

### 🔗 **Processo de Conexão**

1. **Criação da Instância**: Instância é criada com status `connecting`
2. **QR Code Gerado**: Evolution API gera QR Code único para a instância
3. **Escaneamento**: Usuário escaneia QR Code com WhatsApp no celular
4. **Conexão**: WhatsApp se conecta à instância via Evolution API
5. **Status Atualizado**: Status muda para `connected`

### 📊 **Status da Instância**

- **`connecting`**: Instância criada, aguardando conexão do WhatsApp
- **`connected`**: WhatsApp conectado e pronto para uso
- **`disconnected`**: Conexão perdida ou desconectada
- **`error`**: Erro na conexão

## 🏗️ Arquitetura

### 📦 **Services Especializados**

A integração com a Evolution API foi dividida em **3 services especializados**:

#### 1. **`EvolutionApiInstanceService`**
- **Responsabilidade**: Criar instâncias na Evolution API
- **Método**: `createInstance(params: CreateInstanceParams)`
- **Funcionalidades**:
  - Criação de instância com parâmetros customizáveis
  - Impressão automática do QR Code no terminal
  - Tratamento de erros específicos da Evolution API

#### 2. **`EvolutionApiWebhookService`**
- **Responsabilidade**: Configurar webhooks na Evolution API
- **Método**: `configureWebhook(instanceName: string)`
- **Funcionalidades**:
  - Configuração automática com valores padrão
  - URL padrão: `WEBHOOK_URL` (env)
  - Eventos padrão: Apenas `MESSAGES_UPSERT` (configurável)
  - Desabilitação e consulta de webhooks
  - **Nota**: Usa `instanceName` (não `instanceId`) para compatibilidade com Evolution API

#### 3. **`EstablishmentEvolutionApiCreateInstanceService`**
- **Responsabilidade**: Orquestrar o fluxo completo
- **Método**: `execute(establishmentId: string, ownerId: string)`
- **Fluxo**:
  1. Validação de permissões (ADMIN)
  2. Criação da instância
  3. Configuração do webhook
  4. Retorno da resposta completa

### 🔄 **Fluxo de Execução**

```
Usuário → POST /establishments/:id/evolution-api/instance
    ↓
[1] EstablishmentEvolutionApiCreateInstanceService.execute()
    ↓
[2] EstablishmentAccessService.assertUserHasAccess()
    ↓
[3] EvolutionApiInstanceService.createInstance()
    ↓
[4] EvolutionApiWebhookService.configureWebhook()
    ↓
[5] Retorna resposta completa + QR Code
```

### 🎯 **Vantagens da Arquitetura**

- ✅ **Separação de Responsabilidades**: Cada service tem uma função específica
- ✅ **Reutilização**: Services podem ser usados independentemente
- ✅ **Testabilidade**: Cada service pode ser testado isoladamente
- ✅ **Manutenibilidade**: Mudanças em uma funcionalidade não afetam outras
- ✅ **Escalabilidade**: Fácil adicionar novas funcionalidades

## 🔗 Mapeamento de Rotas

| Nossa API | Evolution API | Descrição |
|-----------|---------------|-----------|
| `POST /establishments/:id/evolution-api/instance` | `POST /instance/create` | Criar nova instância |
| `GET /establishments/:id/evolution-api/instance/connect` | `GET /instance/connect` | Conectar instância (futuro) |
| `DELETE /establishments/:id/evolution-api/instance/delete` | `DELETE /instance/delete` | Deletar instância (futuro) |

## 📊 Campos da Resposta

### Instance
- `instanceName`: Nome da instância criada
- `instanceId`: ID único da instância na Evolution API
- `integration`: Tipo de integração (WHATSAPP-BAILEYS, etc.)
- `webhookWaBusiness`: Webhook do WhatsApp Business
- `accessTokenWaBusiness`: Token de acesso do WhatsApp Business
- `status`: Status atual da instância (connecting, connected, etc.)

### QR Code
- `pairingCode`: Código de pareamento (se disponível)
- `code`: Código do QR Code
- `base64`: QR Code em formato base64 para exibição
- `count`: Contador do QR Code

### Settings
- `rejectCall`: Rejeitar chamadas
- `msgCall`: Mensagem de chamada
- `groupsIgnore`: Ignorar grupos
- `alwaysOnline`: Sempre online
- `readMessages`: Ler mensagens
- `readStatus`: Ler status
- `syncFullHistory`: Sincronizar histórico completo
- `wavoipToken`: Token WAVoIP

### Outros Campos
- `hash`: Hash único da instância
- `webhook`: Configurações de webhook
- `websocket`: Configurações de WebSocket
- `rabbitmq`: Configurações do RabbitMQ
- `nats`: Configurações do NATS
- `sqs`: Configurações do SQS 