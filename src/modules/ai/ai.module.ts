import { Module } from '@nestjs/common';

import { AIProviderFactoryService } from './services/ai-provider-factory.service';

@Module({
  providers: [AIProviderFactoryService],
  exports: [AIProviderFactoryService],
})
export class AIModule {}
