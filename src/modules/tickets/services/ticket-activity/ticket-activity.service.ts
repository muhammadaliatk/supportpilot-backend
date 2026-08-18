import { Injectable } from '@nestjs/common';
import { TicketActivityRepository } from '../../repositories/ticket-activity.repository';

@Injectable()
export class TicketActivityService {
  constructor(
    private readonly ticketActivityRepository: TicketActivityRepository,
  ) {}

  async create(
    ticketId: string,
    userId: string,
    organizationId: string,
    action: string,
    description: string,
  ) {
    return this.ticketActivityRepository.create({
      ticketId,
      userId,
      organizationId,
      action,
      description,
    });
  }

  async findByTicket(ticketId: string, organizationId: string) {
    return this.ticketActivityRepository.findByTicket(ticketId, organizationId);
  }
}
