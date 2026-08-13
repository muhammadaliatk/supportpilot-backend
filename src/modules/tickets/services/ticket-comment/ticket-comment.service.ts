import { Injectable, NotFoundException } from '@nestjs/common';

import { TicketRepository } from '../../repositories/ticket.repository/ticket.repository';
import { TicketCommentRepository } from '../../repositories/ticket-comment.repository/ticket-comment.repository';

@Injectable()
export class TicketCommentService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly ticketCommentRepository: TicketCommentRepository,
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

    return this.ticketCommentRepository.create({
      ticketId,
      userId,
      message,
    });
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
