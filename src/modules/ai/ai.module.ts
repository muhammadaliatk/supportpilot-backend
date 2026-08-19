import { Module } from '@nestjs/common';

import { AiController } from './controllers/ai.controller';
import { AiService } from './services/ai.service';
import { OpenAIProvider } from './providers/openai.provider';
import { GeminiProvider } from './providers/gemini.provider';

@Module({
  controllers: [AiController],
  providers: [AiService, OpenAIProvider, GeminiProvider],
  exports: [AiService],
})
export class AiModule {}
