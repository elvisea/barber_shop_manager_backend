import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AIProvider } from '../interfaces/ai-provider-interface';
import { DeepseekProvider } from '../providers/deepseek';
import { GeminiProvider } from '../providers/gemini';

/**
 * AIProviderFactoryService - Factory centralizada para providers de IA
 *
 * RESPONSABILIDADES:
 * - Gerenciar instâncias dos providers de IA disponíveis (Deepseek, Gemini, etc)
 * - Selecionar o provider com base na variável de ambiente AI_PROVIDER
 * - Fornecer instâncias já injetadas via DI do NestJS
 * - Facilitar a extensão para novos providers
 *
 * FLUXO DE USO:
 * 1. Injete a factory onde precisar
 * 2. Use getProvider() para obter o provider configurado
 *
 * EXEMPLO DE USO:
 * ```typescript
 * const provider = aiProviderFactoryService.getProvider();
 * const response = await provider.generateResponse(messages, tools);
 * ```
 *
 * COMO ADICIONAR UM NOVO PROVIDER:
 * - Importe e registre o novo provider no módulo
 * - Injete no construtor da factory
 * - Adicione a lógica de seleção no método getProvider
 */
@Injectable()
export class AIProviderFactoryService {
  private readonly logger = new Logger(AIProviderFactoryService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly deepseekProvider: DeepseekProvider,
    private readonly geminiProvider: GeminiProvider,
  ) {
    this.logger.log('🏭 [FACTORY] AIProviderFactoryService inicializado');
  }

  /**
   * 🎯 OBTER PROVIDER - Retorna instância do provider configurado
   *
   * @param options Opções de configuração (opcional)
   * @returns Instância do AIProvider configurado
   *
   * @example
   * ```typescript
   * const provider = factory.getProvider();
   * const response = await provider.generateResponse(messages, tools);
   * ```
   */
  public getProvider(): AIProvider {
    // Busca chave do provider nas variáveis de ambiente
    const providerKey = this.configService.get<string>(
      'AI_PROVIDER',
      'deepseek-chat',
    );

    this.logger.log(`🏭 [FACTORY] Solicitando provider: ${providerKey}`);

    // Por enquanto, sempre retorna DeepseekProvider
    // Futuramente pode ser expandido para outros providers
    if (providerKey === 'deepseek-chat') {
      this.logger.log('🏭 [FACTORY] Provider retornado: deepseek-chat');
      return this.deepseekProvider;
    }

    if (providerKey === 'gemini') {
      this.logger.log('🏭 [FACTORY] Provider retornado: gemini');
      return this.geminiProvider;
    }

    this.logger.warn(
      `🏭 [FACTORY] Provider "${providerKey}" não encontrado. Usando provider padrão: deepseek-chat`,
    );

    this.logger.log(
      '🏭 [FACTORY] Provider retornado: deepseek-chat (fallback)',
    );

    return this.deepseekProvider;
  }

  /**
   * 📊 ESTATÍSTICAS - Informações sobre a factory
   *
   * @returns Informações de configuração
   */
  getStats(): {
    configuredProvider: string;
    availableProviders: string[];
    isConfigured: boolean;
  } {
    const configuredProvider =
      this.configService.get<string>('AI_PROVIDER') || 'deepseek-chat';
    const apiKey = this.configService.get<string>('DEEPSEEK_API_KEY');

    return {
      configuredProvider,
      availableProviders: ['deepseek-chat', 'gemini'],
      isConfigured: !!apiKey,
    };
  }
}

/**
 * 🔧 Função de conveniência para uso externo
 *
 * @param factory Instância da factory
 * @param options Opções de configuração (opcional)
 * @returns Instância do AIProvider
 */
export function getIAProvider(factory: AIProviderFactoryService): AIProvider {
  return factory.getProvider();
}
