import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { TicketPriority } from '@prisma/client';

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

  async findAll(organizationId: string) {
    return this.prisma.ticket.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }
}
