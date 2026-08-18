import { Module } from '@nestjs/common';

import { PrismaModule } from '../../database/prisma/prisma.module';

import { TicketController } from './controllers/ticket/ticket.controller';
import { TicketCommentRepository } from './repositories/ticket-comment.repository/ticket-comment.repository';
import { TicketRepository } from './repositories/ticket.repository/ticket.repository';
import { TicketCommentService } from './services/ticket-comment/ticket-comment.service';
import { TicketService } from './services/ticket/ticket.service';
import { UsersModule } from '../users/users.module';
import { TicketActivityRepository } from './repositories/ticket-activity.repository';
import { TicketActivityService } from './services/ticket-activity/ticket-activity.service';

@Module({
  imports: [PrismaModule, UsersModule],
  controllers: [TicketController],
  providers: [
    TicketService,
    TicketRepository,
    TicketCommentService,
    TicketCommentRepository,
    TicketActivityRepository,
    TicketActivityService,
  ],
  exports: [TicketService],
})
export class TicketsModule {}
