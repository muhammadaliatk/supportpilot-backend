import { Injectable, NotFoundException } from '@nestjs/common';

import { TicketRepository } from '../../repositories/ticket.repository/ticket.repository';
import { TicketCommentRepository } from '../../repositories/ticket-comment.repository/ticket-comment.repository';
import { TicketActivityService } from '../ticket-activity/ticket-activity.service';
@Injectable()
export class TicketCommentService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly ticketCommentRepository: TicketCommentRepository,
    private readonly ticketActivityService: TicketActivityService,
  ) {}

  async create(
    ticketId: string,
    organizationId: string,
    userId: string,
    message: string,
  ) {
    const ticket = await this.ticketRepository.findById(
      ticketId,
      organizationId,
    );

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const comment = await this.ticketCommentRepository.create({
      ticketId,
      userId,
      message,
    });

    await this.ticketActivityService.create(
      ticketId,
      userId,
      organizationId,
      'COMMENT_ADDED',
      'A comment was added to the ticket',
    );

    return comment;
  }

  async findAll(ticketId: string, organizationId: string) {
    const ticket = await this.ticketRepository.findById(
      ticketId,
      organizationId,
    );

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return this.ticketCommentRepository.findAll(ticketId);
  }
}
