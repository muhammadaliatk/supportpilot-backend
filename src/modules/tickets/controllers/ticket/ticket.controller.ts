import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UseGuards,
  Patch,
  Query,
  NotFoundException,
} from '@nestjs/common';

import { TicketService } from '../../services/ticket/ticket.service';
import { CreateTicketDto } from '../../dto/create-ticket.dto';

import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import type { CurrentUser as CurrentUserType } from '../../../../common/interfaces/current-user.interface';

import { successResponse } from '../../../../common/utils/api-response.util';
import { UpdateTicketDto } from '../../dto/update-ticket.dto';
import { AssignTicketDto } from '../../dto/assign-ticket.dto';
import { CreateTicketCommentDto } from '../../dto/create-ticket-comment.dto';
import { TicketCommentService } from '../../services/ticket-comment/ticket-comment.service';
import { TicketQueryDto } from '../../dto/ticket-query.dto';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { TicketActivityService } from '../../services/ticket-activity/ticket-activity.service';
import { AiService } from '../../../ai/services/ai.service';

@UseGuards(JwtAuthGuard)
@Controller('tickets')
export class TicketController {
  constructor(
    private readonly ticketService: TicketService,
    private readonly ticketCommentService: TicketCommentService,
    private readonly prisma: PrismaService,
    private readonly ticketActivityService: TicketActivityService,
    private readonly aiService: AiService,
  ) {}

  @Post()
  async create(
    @Body() dto: CreateTicketDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    const ticket = await this.ticketService.create(
      dto,
      user.organizationId,
      user.id,
    );

    return successResponse(ticket, 'Ticket created successfully');
  }

  @Get()
  async findAll(
    @CurrentUser() user: CurrentUserType,
    @Query() query: TicketQueryDto,
  ) {
    const tickets = await this.ticketService.findAll(
      user.organizationId,
      query,
    );

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

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateTicketDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    const ticket = await this.ticketService.update(
      id,
      user.organizationId,
      user.id,
      dto,
    );

    return successResponse(ticket, 'Ticket updated successfully');
  }

  @Patch(':id/assign')
  async assign(
    @Param('id') id: string,
    @Body() dto: AssignTicketDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    const ticket = await this.ticketService.assign(
      id,
      user.organizationId,
      user.id,
      dto.assignedToId,
    );

    return successResponse(ticket, 'Ticket assigned successfully');
  }

  @Post(':id/comments')
  async createComment(
    @Param('id') id: string,
    @Body() dto: CreateTicketCommentDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    const comment = await this.ticketCommentService.create(
      id,
      user.organizationId,
      user.id,
      dto.message,
    );

    return successResponse(comment, 'Comment created successfully');
  }

  @Get(':id/comments')
  async findComments(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    const comments = await this.ticketCommentService.findAll(
      id,
      user.organizationId,
    );

    return successResponse(comments, 'Comments retrieved successfully');
  }

  async findMembers(organizationId: string) {
    return this.prisma.organizationUser.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
            status: true,
            createdAt: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }

  @Get('stats')
  async getStats(@CurrentUser() user: CurrentUserType) {
    const stats = await this.ticketService.getStats(user.organizationId);

    return successResponse(stats, 'Ticket statistics retrieved successfully');
  }

  @Get(':id/activities')
  async getActivities(
    @Param('id') ticketId: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    const activities = await this.ticketActivityService.findByTicket(
      ticketId,
      user.organizationId,
    );

    return successResponse(
      activities,
      'Ticket activities retrieved successfully',
    );
  }

  @Post(':id/ai/reply')
  async generateAiReply(
    @Param('id') ticketId: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    const ticket = await this.ticketService.findById(
      ticketId,
      user.organizationId,
    );

    if (!ticket) {
      throw new NotFoundException('Ticket not found');
    }

    const comments = await this.ticketCommentService.findAll(
      ticketId,
      user.organizationId,
    );

    const response = await this.aiService.generateCustomerReply({
      subject: ticket.subject,
      description: ticket.description,
      customer: ticket.customer,
      comments,
    });

    return successResponse(
      {
        ticketId: ticket.id,
        reply: response,
      },
      'AI reply generated successfully',
    );
  }
}
