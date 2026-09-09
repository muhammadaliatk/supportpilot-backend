import { Module } from '@nestjs/common';

import { PublicSupportController } from './controllers/public-support.controller';
import { PublicSupportService } from './services/public-support.service';
import { PublicSupportRepository } from './repositories/public-support.repository';

@Module({
  controllers: [PublicSupportController],
  providers: [PublicSupportService, PublicSupportRepository],
})
export class PublicSupportModule {}
