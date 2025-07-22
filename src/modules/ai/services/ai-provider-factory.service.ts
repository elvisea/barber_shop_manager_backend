import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { AIProvider } from '../interfaces/ai-provider-interface';
import { DeepseekProvider } from '../providers/deepseek';
import { DeepseekNewProvider } from '../providers/deepseek-new.provider';

import { AIToolExecutorService } from './ai-tool-executor.service';

@Injectable()
export class AIProviderFactoryService {
  private readonly logger = new Logger(AIProviderFactoryService.name);
  private readonly configService: ConfigService;

  private static providers: Record<string, (options?: any) => AIProvider> = {
    // 'deepseek-chat': (options?: any) => new DeepseekProvider(options),
    'deepseek-chat': (options?: any) => new DeepseekNewProvider(options),
  };

  constructor(
    configService: ConfigService,
    private readonly toolExecutor: AIToolExecutorService,
  ) {
    this.configService = configService;
  }

  /**
   * Registra um novo provider na factory
   */
  public static registerProvider(
    key: string,
    providerFn: (options?: any) => AIProvider,
  ): void {
    AIProviderFactoryService.providers[key] = providerFn;
  }

  /**
   * Retorna a instância do provider configurado ou fallback para o padrão
   */
  public getProvider(options?: any): AIProvider {
    // Busca chave do provider nas variáveis de ambiente ou options
    const providerKey =
      options?.providerKey ||
      this.configService.get<string>('AI_PROVIDER') ||
      'deepseek-chat';

    if (providerKey in AIProviderFactoryService.providers) {
      this.logger.log(`Usando provider de IA: ${providerKey}`);

      // Se for o novo provider, passar o toolExecutor
      if (providerKey === 'deepseek-chat' && this.toolExecutor) {
        return new DeepseekNewProvider(options, this.toolExecutor);
      }

      return AIProviderFactoryService.providers[providerKey](options);
    }

    this.logger.warn(
      `Provider "${providerKey}" não encontrado. Usando provider padrão: deepseek-chat`,
    );
    return new DeepseekProvider(options);
  }
}

// Função de conveniência para uso externo
export function getIAProvider(
  factory: AIProviderFactoryService,
  options?: any,
): AIProvider {
  return factory.getProvider(options);
}
