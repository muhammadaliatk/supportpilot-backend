import { Controller, Get } from '@nestjs/common';

import { AiService } from '../services/ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Get('test')
  async test() {
    const result = await this.aiService.generateText(
      'Reply with exactly: SupportPilot AI is working.',
    );

    return {
      success: true,
      message: 'AI test successful',
      data: {
        response: result,
      },
    };
  }
}
