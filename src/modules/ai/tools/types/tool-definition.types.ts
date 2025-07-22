import { ChatCompletionTool } from 'openai/resources/chat/completions';

/**
 * 🛠️ Tipos base para Function Calling Tools
 * Baseado nas boas práticas da OpenAI Node.js SDK
 */

export interface ToolDefinition {
  name: string;
  description: string;
  parameters: Record<string, any>;
  required?: string[];
}

export interface ToolHandler<TInput = any, TOutput = any> {
  definition: ToolDefinition;
  handler: (
    args: TInput,
    context?: ToolContext,
  ) => Promise<ToolResult<TOutput>>;
}

export interface ToolContext {
  userId?: number;
  establishmentId?: number;
  phoneNumber?: string;
  payload?: any;
}

export interface ToolResult<T = any> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ToolRegistry {
  [key: string]: ToolHandler;
}

/**
 * 🔄 Conversão para ChatCompletionTool da OpenAI
 */
export function toChatCompletionTool(
  toolHandler: ToolHandler,
): ChatCompletionTool {
  return {
    type: 'function',
    function: {
      name: toolHandler.definition.name,
      description: toolHandler.definition.description,
      parameters: {
        type: 'object',
        properties: toolHandler.definition.parameters,
        required: toolHandler.definition.required || [],
      },
    },
  };
}
