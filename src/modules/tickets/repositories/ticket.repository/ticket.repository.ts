import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { Prisma, TicketPriority, TicketStatus } from '@prisma/client';

@Injectable()
export class TicketRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    subject: string;
    description: string;
    priority: TicketPriority;
    organizationId: string;
    createdById: string;
  }) {
    return this.prisma.ticket.create({
      data,
    });
  }

  async findById(id: string, organizationId: string) {
    return this.prisma.ticket.findFirst({
      where: {
        id,
        organizationId,
      },
    });
  }

  async findAll(
    organizationId: string,
    query: {
      status?: TicketStatus;
      priority?: TicketPriority;
      assignedToId?: string;
      search?: string;
      page: number;
      limit: number;
    },
  ) {
    const { status, priority, assignedToId, search, page, limit } = query;

    const where: Prisma.TicketWhereInput = {
      organizationId,
      ...(status && { status }),
      ...(priority && { priority }),
      ...(assignedToId && { assignedToId }),
      ...(search && {
        OR: [
          {
            subject: {
              contains: search,
              mode: 'insensitive',
            },
          },
          {
            description: {
              contains: search,
              mode: 'insensitive',
            },
          },
        ],
      }),
    };

    const skip = (page - 1) * limit;

    const [items, total] = await this.prisma.$transaction([
      this.prisma.ticket.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: 'desc',
        },
      }),

      this.prisma.ticket.count({
        where,
      }),
    ]);

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async update(
    id: string,
    organizationId: string,
    data: {
      subject?: string;
      description?: string;
      priority?: TicketPriority;
      status?: TicketStatus;
    },
  ) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!ticket) {
      return null;
    }

    return this.prisma.ticket.update({
      where: {
        id,
      },
      data,
    });
  }

  async assign(id: string, organizationId: string, assignedToId: string) {
    const ticket = await this.prisma.ticket.findFirst({
      where: {
        id,
        organizationId,
      },
    });

    if (!ticket) {
      return null;
    }

    return this.prisma.ticket.update({
      where: {
        id,
      },
      data: {
        assignedToId,
      },
    });
  }
}
