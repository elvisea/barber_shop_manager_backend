import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AIProvider } from '../interfaces/ai-provider-interface';
import { DeepseekProvider } from '../providers/deepseek';

/**
 * 🏭 AIProviderFactoryService - Factory para Providers de IA
 *
 * RESPONSABILIDADES:
 * 1. Gerenciar instâncias de providers de IA
 * 2. Configurar providers com dependências necessárias
 * 3. Fornecer acesso centralizado aos providers
 *
 * FLUXO:
 * 1. Recebe solicitação de provider
 * 2. Verifica configuração
 * 3. Retorna instância configurada
 */
@Injectable()
export class AIProviderFactoryService {
  private readonly logger = new Logger(AIProviderFactoryService.name);
  private readonly configService: ConfigService;

  constructor(configService: ConfigService) {
    this.configService = configService;
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
  public getProvider(options?: any): AIProvider {
    // Busca chave do provider nas variáveis de ambiente ou options
    const providerKey =
      options?.providerKey ||
      this.configService.get<string>('AI_PROVIDER') ||
      'deepseek-chat';

    this.logger.log(`🏭 [FACTORY] Solicitando provider: ${providerKey}`);

    // Por enquanto, sempre retorna DeepseekProvider
    // Futuramente pode ser expandido para outros providers
    if (providerKey === 'deepseek-chat') {
      this.logger.log('🏭 [FACTORY] Criando instância do DeepseekProvider');
      return new DeepseekProvider(this.configService);
    }

    this.logger.warn(
      `🏭 [FACTORY] Provider "${providerKey}" não encontrado. Usando provider padrão: deepseek-chat`,
    );

    return new DeepseekProvider(this.configService);
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
      availableProviders: ['deepseek-chat'],
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
export function getIAProvider(
  factory: AIProviderFactoryService,
  options?: any,
): AIProvider {
  return factory.getProvider(options);
}
