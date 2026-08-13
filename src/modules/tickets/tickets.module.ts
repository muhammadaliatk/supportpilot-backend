import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma/prisma.module';

import { TicketController } from './controllers/ticket/ticket.controller';
import { TicketService } from './services/ticket/ticket.service';
import { TicketRepository } from './repositories/ticket.repository/ticket.repository';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [TicketController],
  providers: [TicketService, TicketRepository],
  exports: [TicketService],
})
export class TicketsModule {}
