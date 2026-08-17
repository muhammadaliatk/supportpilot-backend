import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { TicketPriority } from '@prisma/client';

import { TicketRepository } from '../../repositories/ticket.repository/ticket.repository';
import { CreateTicketDto } from '../../dto/create-ticket.dto';
import { UpdateTicketDto } from '../../dto/update-ticket.dto';
import { UsersService } from '../../../users/users.service';
import { TicketQueryDto } from '../../dto/ticket-query.dto';

@Injectable()
export class TicketService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly usersService: UsersService,
  ) {}

  async create(dto: CreateTicketDto, userId: string, organizationId: string) {
    return this.ticketRepository.create({
      subject: dto.subject,
      description: dto.description,
      priority: dto.priority ?? TicketPriority.MEDIUM,
      organizationId,
      createdById: userId,
    });
  }

  async findAll(organizationId: string, query: TicketQueryDto) {
    return this.ticketRepository.findAll(organizationId, query);
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

  async assign(ticketId: string, organizationId: string, assignedToId: string) {
    const ticket = await this.ticketRepository.findById(
      ticketId,
      organizationId,
    );

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const user = await this.usersService.findByIdInOrganization(
      assignedToId,
      organizationId,
    );

    if (!user) {
      throw new BadRequestException(
        'Assigned user does not belong to this organization',
      );
    }

    return this.ticketRepository.assign(ticketId, organizationId, assignedToId);
  }

  async getStats(organizationId: string) {
    return await this.ticketRepository.getStats(organizationId);
  }
}
