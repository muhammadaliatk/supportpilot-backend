import { Module } from '@nestjs/common';
import { RegistrationService } from './services/registration/registration.service';
import { UsersModule } from '../users/users.module';
import { OrganizationsModule } from '../organizations/organizations.module';
import { PrismaModule } from '../../database/prisma/prisma.module';

@Module({
  imports: [PrismaModule, UsersModule, OrganizationsModule],
  providers: [RegistrationService],
  exports: [RegistrationService],
})
export class RegistrationModule {}
