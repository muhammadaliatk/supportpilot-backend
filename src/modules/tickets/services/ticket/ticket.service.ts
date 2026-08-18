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
import { TicketActivityService } from '../ticket-activity/ticket-activity.service';

@Injectable()
export class TicketService {
  constructor(
    private readonly ticketRepository: TicketRepository,
    private readonly usersService: UsersService,
    private readonly ticketActivityService: TicketActivityService,
  ) {}

  async create(dto: CreateTicketDto, organizationId: string, userId: string) {
    const ticket = await this.ticketRepository.create({
      subject: dto.subject,
      description: dto.description,
      priority: dto.priority ?? TicketPriority.MEDIUM,
      organizationId,
      createdById: userId,
    });

    await this.ticketActivityService.create(
      ticket.id,
      userId,
      organizationId,
      'CREATED',
      `Ticket "${ticket.subject}" was created`,
    );

    return ticket;
  }

  async findAll(organizationId: string, query: TicketQueryDto) {
    return this.ticketRepository.findAll(organizationId, query);
  }

  async findById(id: string, organizationId: string) {
    return this.ticketRepository.findById(id, organizationId);
  }

  async update(
    ticketId: string,
    organizationId: string,
    userId: string,
    dto: UpdateTicketDto,
  ) {
    const existingTicket = await this.ticketRepository.findById(
      ticketId,
      organizationId,
    );

    if (!existingTicket) {
      throw new NotFoundException('Ticket not found');
    }

    const ticket = await this.ticketRepository.update(
      ticketId,
      organizationId,
      dto,
    );

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    if (dto.status && dto.status !== existingTicket.status) {
      await this.ticketActivityService.create(
        ticket.id,
        userId,
        organizationId,
        'STATUS_CHANGED',
        `Ticket status changed from ${existingTicket.status} to ${dto.status}`,
      );
    }

    if (dto.priority && dto.priority !== existingTicket.priority) {
      await this.ticketActivityService.create(
        ticket.id,
        userId,
        organizationId,
        'PRIORITY_CHANGED',
        `Ticket priority changed from ${existingTicket.priority} to ${dto.priority}`,
      );
    }

    if (dto.subject && dto.subject !== existingTicket.subject) {
      await this.ticketActivityService.create(
        ticket.id,
        userId,
        organizationId,
        'SUBJECT_CHANGED',
        'Ticket subject was updated',
      );
    }

    if (dto.description && dto.description !== existingTicket.description) {
      await this.ticketActivityService.create(
        ticket.id,
        userId,
        organizationId,
        'DESCRIPTION_CHANGED',
        'Ticket description was updated',
      );
    }

    return ticket;
  }

  async assign(
    ticketId: string,
    organizationId: string,
    userId: string,
    assignedToId: string,
  ) {
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

    const updatedTicket = await this.ticketRepository.assign(
      ticketId,
      organizationId,
      assignedToId,
    );

    if (!updatedTicket) {
      throw new NotFoundException('Ticket not found');
    }

    await this.ticketActivityService.create(
      updatedTicket.id,
      userId,
      organizationId,
      'ASSIGNED',
      `Ticket assigned to ${user.firstName} ${user.lastName}`,
    );

    return updatedTicket;
  }

  async getStats(organizationId: string) {
    return await this.ticketRepository.getStats(organizationId);
  }
}
