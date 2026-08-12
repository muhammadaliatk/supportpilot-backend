import { Injectable, NotFoundException } from '@nestjs/common';
import { TicketPriority } from '@prisma/client';

import { TicketRepository } from '../../repositories/ticket.repository/ticket.repository';
import { CreateTicketDto } from '../../dto/create-ticket.dto';
import { UpdateTicketDto } from '../../dto/update-ticket.dto';

@Injectable()
export class TicketService {
  constructor(private readonly ticketRepository: TicketRepository) {}

  async create(dto: CreateTicketDto, userId: string, organizationId: string) {
    return this.ticketRepository.create({
      subject: dto.subject,
      description: dto.description,
      priority: dto.priority ?? TicketPriority.MEDIUM,
      organizationId,
      createdById: userId,
    });
  }

  async findAll(organizationId: string) {
    return this.ticketRepository.findAll(organizationId);
  }

  async findById(id: string, organizationId: string) {
    return this.ticketRepository.findById(id, organizationId);
  }

  async update(id: string, organizationId: string, dto: UpdateTicketDto) {
    const ticket = await this.ticketRepository.findById(id, organizationId);

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    return this.ticketRepository.update(id, organizationId, dto);
  }
}
