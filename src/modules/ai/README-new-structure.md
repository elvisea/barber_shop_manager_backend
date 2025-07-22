# 🏗️ Estrutura Atual do Sistema AI

Este documento descreve a **estrutura atual implementada** para function calling no sistema de barbearia, baseada nas **boas práticas da OpenAI** e seguindo padrões limpos e organizados.

## 🎯 **Estrutura Implementada**

### ✅ **O que foi implementado:**

1. **Sistema de Buffer/Debounce** - Evita respostas fragmentadas
2. **Tools Centralizadas** - Registro unificado de todas as tools
3. **Function Calling Direto** - Comunicação direta com DeepSeek
4. **Histórico de Conversas** - Contexto completo das conversas
5. **Logs Detalhados** - Rastreamento completo das operações

## 📁 **Organização Atual de Arquivos**

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
└── README.md                        # Documentação principal
```

## 🔧 **Componentes Implementados**

### **1. 📋 Tipos Base (`tool-definition.types.ts`)**

```typescript
export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  required?: string[];
}

export interface ToolHandler<TInput = any, TOutput = any> {
  definition: ToolDefinition;
  handler: (args: TInput, context?: ToolContext) => Promise<ToolResult<TOutput>>;
}

export interface ToolContext {
  userId?: number;
  establishmentId?: number;
  phoneNumber?: string;
  payload?: any;
}
```

### **2. 📝 Definições de Tools (`definitions/plan-tools.ts`)**

```typescript
export const PLAN_TOOLS: ChatCompletionTool[] = [
  {
    type: 'function',
    function: {
      name: 'create_plan',
      description: 'Cria um novo plano de barbearia',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Nome do plano' },
          price: { type: 'number', description: 'Preço em reais' },
          // ...
        },
        required: ['name', 'price', 'description', 'duration', 'isActive']
      }
    }
  },
  {
    type: 'function',
    function: {
      name: 'get_plans',
      description: 'Lista todos os planos disponíveis',
      parameters: {
        type: 'object',
        properties: {
          page: { type: 'number', description: 'Página atual' },
          limit: { type: 'number', description: 'Limite por página' }
        },
        required: []
      }
    }
  }
];
```

### **3. ⚙️ Manipuladores (`handlers/plan-handlers.ts`)**

```typescript
@Injectable()
export class PlanToolHandlers {
  createPlan: ToolHandler<PlanCreateRequestDTO, PlanCreateResponseDTO> = {
    definition: PLAN_TOOLS[0],
    handler: async (args, context) => {
      // Converte preço para centavos
      const priceInCents = Math.round(args.price * 100);
      
      // Chama API para criar plano
      const response = await this.httpClientService.request(
        `${this.apiUrl}/plans`,
        { method: 'POST', data: { ...args, price: priceInCents } }
      );
      
      return { success: true, data: response };
    },
  };

  getPlans: ToolHandler<PlanFindAllQueryDTO, PlanFindAllResponseDTO> = {
    definition: PLAN_TOOLS[1],
    handler: async (args, context) => {
      // Busca planos da API
      const response = await this.httpClientService.request(
        `${this.apiUrl}/plans?page=${args.page}&limit=${args.limit}`
      );
      
      // Converte preços de centavos para reais
      const plansWithRealPrices = response.data.map(plan => ({
        ...plan,
        price: plan.price / 100,
      }));
      
      return { success: true, data: { ...response, data: plansWithRealPrices } };
    },
  };
}
```

### **4. 📚 Registro Unificado (`registry/tool-registry.ts`)**

```typescript
@Injectable()
export class ToolRegistryService {
  private readonly toolRegistry: ToolRegistry = {};

  constructor(private readonly planHandlers: PlanToolHandlers) {
    this.registerTools();
  }

  private registerTools(): void {
    this.toolRegistry['create_plan'] = this.planHandlers.createPlan;
    this.toolRegistry['get_plans'] = this.planHandlers.getPlans;
  }

  getChatCompletionTools(): ChatCompletionTool[] {
    return Object.values(this.toolRegistry).map(toChatCompletionTool);
  }

  async executeTool(name: string, args: object, context?: any): Promise<any> {
    const tool = this.getTool(name);
    return await tool.handler(args, context);
  }
}
```

### **5. 🤖 Comunicação com IA (EventMessagesUpsertService)**

```typescript
@Injectable()
export class EventMessagesUpsertService {
  // Sistema de buffer/debounce
      async handle(payload: MessagesUpsertLog): Promise<void> {
    const { remoteJid, message } = this.extractDataPayload(payload);
    
    // Adiciona ao buffer e configura timer
    buffer.lastMessage = message;
    buffer.timer = setTimeout(() => {
      this.processBufferWithNewFlow(remoteJid, payload);
    }, 10000); // 10s de inatividade
  }

  // Comunicação direta com DeepSeek
  private async sendToAI(messages: ChatCompletionMessageParam[], tools: ChatCompletionTool[]) {
    const client = new OpenAI({
      apiKey: 'sk-8eb3e14ed4754ed79dd34c0d92749936',
      baseURL: 'https://api.deepseek.com',
    });

    const completion = await client.chat.completions.create({
      model: 'deepseek-chat',
      messages,
      tools,
      max_tokens: 1000,
      temperature: 0.7,
      tool_choice: 'auto',
    });

    return completion.choices[0].message;
  }
}
```

## 🎯 **Como Funciona Atualmente**

### **1. Fluxo Principal:**

```typescript
// 1. Usuário envia mensagem via WhatsApp
// 2. EventMessagesUpsertService recebe a mensagem
// 3. Sistema aguarda inatividade (10s)
// 4. Busca histórico de conversas (excluindo mensagem atual)
// 5. Envia para DeepSeek com function calling
// 6. Executa tools se necessário
// 7. Retorna resposta para WhatsApp
```

### **2. Sistema de Buffer/Debounce:**

```typescript
// Evita respostas fragmentadas
const buffer = {
  lastMessage: "mensagem atual",
  lastPayload: payload,
  timer: setTimeout(() => processMessage(), 10000),
  lastMessageTime: Date.now()
};
```

### **3. Function Calling:**

```typescript
// Tools disponíveis
const tools = toolRegistry.getChatCompletionTools();

// IA decide chamar a tool
const response = await sendToAI(messages, tools);
if (response.tool_calls) {
  for (const toolCall of response.tool_calls) {
    const args = JSON.parse(toolCall.function.arguments);
    const result = await toolRegistry.executeTool(toolCall.function.name, args);
    
    // Adiciona resultado ao histórico
    messages.push(response);
    messages.push({
      role: 'tool',
      tool_call_id: toolCall.id,
      content: JSON.stringify(result.data),
    });
  }
  
  // Chama IA novamente com resultado
  const finalResponse = await sendToAI(messages, tools);
}
```

## 🎭 **Prompt da IA**

```typescript
// Prompt atual (v3.3.0)
export const BARBER_SHOP_PROMPT = JSON.stringify({
  prompt: 'You are Luna, a friendly and helpful virtual assistant for a barber shop. You have access to functions to help with plan management. IMPORTANT: When user asks to "listar planos", "ver planos", "mostrar planos", or similar, you MUST call the get_plans function (do not write about it, just call it). When user asks to "criar plano", "novo plano", or provides plan details, you MUST call the create_plan function. For greetings and general conversation, respond naturally without calling any functions. NEVER write about functions or describe what you will do - just call the appropriate function when needed.',
  directives: [
    'Respond naturally to greetings and general conversation.',
    'MUST call get_plans function when user asks to list/see/show plans.',
    'MUST call create_plan function when user wants to create a new plan.',
    'Be polite, friendly and concise.',
    'NEVER write about functions - just call them when needed.',
    'Do not describe what you will do - just do it by calling functions.',
  ],
});
```

## 📊 **Logs e Monitoramento**

O sistema possui logs detalhados categorizados:

- `📨 [ENTRADA]` - Mensagens recebidas
- `⏰ [TIMER]` - Sistema de buffer/debounce
- `📚 [HISTÓRICO]` - Busca de contexto
- `🤖 [DEEPSEEK]` - Comunicação com IA
- `🔧 [TOOLS]` - Execução de tools
- `📤 [WHATSAPP]` - Envio de mensagens
- `✅ [SUCESSO]` / `❌ [ERRO]` - Status das operações

## 🚀 **Vantagens da Estrutura Atual**

### ✅ **Benefícios Implementados:**

1. **🎯 Simplicidade:**
   - Sistema de buffer focado apenas em debounce
   - Comunicação direta com DeepSeek
   - Logs organizados e detalhados

2. **📁 Organização:**
   - Tools centralizadas em `/tools`
   - Separação clara entre definições e manipuladores
   - Registro unificado

3. **🔧 Manutenibilidade:**
   - Fácil adicionar novas tools
   - Tipagem forte em todos os níveis
   - Código reutilizável

4. **🤖 Compatibilidade:**
   - Segue as boas práticas da OpenAI
   - Usa `ChatCompletionTool[]` nativo
   - Estrutura escalável

5. **🧪 Testabilidade:**
   - Cada componente isolado
   - Fácil de mockar e testar
   - Logs detalhados

## 🎯 **Próximos Passos**

1. **Adicionar mais tools** - Clientes, agendamentos, serviços
2. **Implementar cache** - Para otimizar performance
3. **Adicionar validação Zod** - Para validação robusta
4. **Testes e2e** - Cobertura completa de testes
5. **Monitoramento** - Métricas de performance e uso

---

**💡 Esta estrutura atual resolve todos os problemas identificados e segue as melhores práticas da OpenAI para function calling, com foco em simplicidade e manutenibilidade.** 