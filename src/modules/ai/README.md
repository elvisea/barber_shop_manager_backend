# 🤖 Módulo AI - Sistema de Function Calling

Este módulo implementa **Function Calling** para o sistema de barbearia, permitindo que a IA execute funções específicas para buscar informações e realizar operações no sistema.

## 🎯 Funcionalidades

- ✅ **Function Calling** - IA pode chamar funções específicas
- ✅ **Buffer/Debounce** - Sistema de inatividade para evitar respostas fragmentadas
- ✅ **Histórico de Conversas** - Contexto completo das conversas
- ✅ **Tools Centralizadas** - Registro unificado de todas as tools
- ✅ **Logs Detalhados** - Rastreamento completo das operações
- ✅ **Integração WhatsApp** - Comunicação direta via Evolution API

## 🏗️ Estrutura Atual

```
src/modules/ai/
├── interfaces/                      # 📋 Interfaces do sistema
│   ├── ai-provider-interface.ts     # Interface principal do provider
│   └── ai-function.interface.ts     # Interfaces para function calling
├── tools/                           # 🛠️ Sistema de tools
│   ├── types/                       # 📋 Tipos das tools
│   │   └── tool-definition.types.ts
│   ├── definitions/                 # 📝 Definições das tools
│   │   └── plan-tools.ts
│   ├── handlers/                    # ⚙️ Manipuladores das tools
│   │   └── plan-handlers.ts
│   └── registry/                    # 📚 Registro centralizado
│       └── tool-registry.ts
├── prompts/                         # 🎭 Prompts centralizados
│   └── barber-shop-prompt.ts
└── README.md                        # Esta documentação
```

## 🚀 Como Funciona

### 1. Fluxo Principal

```typescript
// 1. Usuário envia mensagem via WhatsApp
// 2. EventMessagesUpsertService recebe a mensagem
// 3. Sistema aguarda inatividade (10s)
// 4. Busca histórico de conversas
// 5. Envia para IA com function calling
// 6. Executa tools se necessário
// 7. Retorna resposta para WhatsApp
```

### 2. Sistema de Buffer/Debounce

```typescript
// Evita respostas fragmentadas
const buffer = {
  lastMessage: "mensagem atual",
  timer: setTimeout(() => processMessage(), 10000),
  lastMessageTime: Date.now()
};
```

### 3. Function Calling

```typescript
// Tools disponíveis
const tools = [
  {
    type: 'function',
    function: {
      name: 'get_plans',
      description: 'Lista todos os planos disponíveis',
      parameters: { /* ... */ }
    }
  }
];

// IA decide chamar a tool
const response = await sendToAI(messages, tools);
if (response.tool_calls) {
  // Executa as tools
  for (const toolCall of response.tool_calls) {
    const result = await toolRegistry.executeTool(toolCall.function.name, args);
  }
}
```

## 📋 Tools Disponíveis

### 1. `get_plans`
Lista todos os planos disponíveis de forma paginada.

**Parâmetros:**
- `page` (number, opcional): Página atual (padrão: 1)
- `limit` (number, opcional): Limite de itens por página (padrão: 10)

**Exemplo de uso:**
```typescript
// Usuário: "quero ver os planos"
// IA chama: get_plans({ page: 1, limit: 10 })
// Retorna: Lista de planos com preços em reais
```

### 2. `create_plan`
Cria um novo plano com os dados fornecidos.

**Parâmetros:**
- `name` (string, obrigatório): Nome do plano
- `description` (string, obrigatório): Descrição do plano
- `price` (number, obrigatório): Preço do plano em reais
- `duration` (number, obrigatório): Duração do plano em dias
- `isActive` (boolean, obrigatório): Se o plano está ativo

**Exemplo de uso:**
```typescript
// Usuário: "criar plano Premium com preço 199.99"
// IA chama: create_plan({ name: "Premium", price: 199.99, ... })
// Retorna: Plano criado com sucesso
```

## 🎭 Prompt da IA

O sistema usa o prompt `BARBER_SHOP_PROMPT` que:

- Define a personalidade da **Luna** (assistente virtual)
- Especifica quando usar function calling
- Proíbe descrições de functions
- Mantém tom natural para conversas gerais

```typescript
// Prompt atual (v3.3.0)
"You are Luna, a friendly and helpful virtual assistant for a barber shop. 
You have access to functions to help with plan management. 
IMPORTANT: When user asks to 'listar planos', 'ver planos', 'mostrar planos', 
or similar, you MUST call the get_plans function..."
```

## 🔧 Integração com o Sistema

### EventMessagesUpsertService

```typescript
@Injectable()
export class EventMessagesUpsertService {
  // Sistema de buffer/debounce
  async handle(payload: MessagesUpsertLog): Promise<void>
  
  // Processamento principal
  private async processBufferWithNewFlow(remoteJid: string, payload: MessagesUpsertLog): Promise<void>
  
  // Comunicação com IA
  private async sendToAI(messages: ChatCompletionMessageParam[], tools: ChatCompletionTool[])
  
  // Histórico de conversas
  private async getContextMessages({ remoteJid, instance, apikey, excludeMessages })
}
```

### ToolRegistryService

```typescript
@Injectable()
export class ToolRegistryService {
  // Obter tools para IA
  getChatCompletionTools(): ChatCompletionTool[]
  
  // Executar tool específica
  async executeTool(name: string, args: object, context?: any): Promise<any>
  
  // Estatísticas
  getStats(): { totalTools: number; toolNames: string[] }
}
```

## 📊 Logs e Monitoramento

O sistema possui logs detalhados categorizados:

- `📨 [ENTRADA]` - Mensagens recebidas
- `⏰ [TIMER]` - Sistema de buffer/debounce
- `📚 [HISTÓRICO]` - Busca de contexto
- `🤖 [DEEPSEEK]` - Comunicação com IA
- `🔧 [TOOLS]` - Execução de tools
- `📤 [WHATSAPP]` - Envio de mensagens
- `✅ [SUCESSO]` / `❌ [ERRO]` - Status das operações

## 🚀 Como Adicionar Novas Tools

### 1. Definir a Tool

```typescript
// tools/definitions/new-tools.ts
export const NEW_TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'my_new_tool',
      description: 'Descrição da nova tool',
      parameters: {
        type: 'object',
        properties: {
          param1: {
            type: 'string',
            description: 'Descrição do parâmetro'
          }
        },
        required: ['param1']
      }
    }
  }
];
```

### 2. Criar o Handler

```typescript
// tools/handlers/new-handlers.ts
@Injectable()
export class NewToolHandlers {
  myNewTool: ToolHandler<InputType, OutputType> = {
    definition: NEW_TOOLS[0],
    handler: async (args, context) => {
      // Implementação da tool
      return { success: true, data: result };
    },
  };
}
```

### 3. Registrar no ToolRegistry

```typescript
// tools/registry/tool-registry.ts
private registerTools(): void {
  this.toolRegistry['my_new_tool'] = this.newHandlers.myNewTool;
}
```

## 🧪 Testes

```bash
# Testes unitários
npm run test src/modules/ai

# Testes específicos
npm run test -- --testNamePattern="ToolRegistryService"
npm run test -- --testNamePattern="EventMessagesUpsertService"
```

## 📚 Referências

- [OpenAI Function Calling](https://platform.openai.com/docs/guides/function-calling)
- [DeepSeek Function Calling](https://api-docs.deepseek.com/guides/function_calling)
- [OpenAI Node.js Library](https://github.com/openai/openai-node)

## 🎯 Próximos Passos

1. **Adicionar mais tools** - Clientes, agendamentos, serviços
2. **Implementar cache** - Para otimizar performance
3. **Adicionar validação Zod** - Para validação robusta
4. **Testes e2e** - Cobertura completa de testes
5. **Monitoramento** - Métricas de performance e uso 