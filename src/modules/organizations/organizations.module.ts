import { Module } from '@nestjs/common';
import { OrganizationService } from './services/organization/organization.service';
import { OrganizationController } from './controllers/organization/organization.controller';
import { OrganizationRepository } from './repositories/organization.repository';

@Module({
  controllers: [OrganizationController],
  providers: [OrganizationService, OrganizationRepository],
  exports: [OrganizationRepository],
})
export class OrganizationsModule {}
