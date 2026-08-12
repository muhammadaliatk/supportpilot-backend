import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';

import { TicketService } from '../../services/ticket/ticket.service';
import { CreateTicketDto } from '../../dto/create-ticket.dto';

import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import type { CurrentUser as CurrentUserType } from '../../../../common/interfaces/current-user.interface';

import { successResponse } from '../../../../common/utils/api-response.util';

@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketController {
  constructor(private readonly ticketService: TicketService) {}

  @Post()
  async create(
    @Body() dto: CreateTicketDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    const ticket = await this.ticketService.create(
      dto,
      user.id,
      user.organizationId,
    );

    return successResponse(ticket, 'Ticket created successfully');
  }

  @Get()
  async findAll(@CurrentUser() user: CurrentUserType) {
    const tickets = await this.ticketService.findAll(user.organizationId);

    return successResponse(tickets, 'Tickets retrieved successfully');
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    const ticket = await this.ticketService.findById(id, user.organizationId);

    return successResponse(ticket, 'Ticket retrieved successfully');
  }
}
