import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { DeepseekProvider } from './providers/deepseek';
import { GeminiProvider } from './providers/gemini';
import { AIProviderFactoryService } from './services/ai-provider-factory.service';
import { AIToolExecutorService } from './services/ai-tool-executor.service';
import { PlanToolHandlers } from './tools/handlers/plan-handlers';
import { ToolRegistryService } from './tools/registry/tool-registry';

import { ErrorMessageModule } from '@/error-message/error-message.module';
import { HttpClientService } from '@/http-client/http-client.service';

@Module({
  imports: [HttpModule, ConfigModule, ErrorMessageModule],
  providers: [
    AIProviderFactoryService,
    DeepseekProvider,
    GeminiProvider,
    AIToolExecutorService,
    ToolRegistryService,
    PlanToolHandlers,
    HttpClientService,
  ],
  exports: [
    AIProviderFactoryService,
    AIToolExecutorService,
    ToolRegistryService,
    PlanToolHandlers,
  ],
})
export class AIModule {}
