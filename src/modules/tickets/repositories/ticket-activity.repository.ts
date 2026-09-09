import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';

@Injectable()
export class TicketActivityRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    ticketId: string;
    userId: string | null;
    organizationId: string;
    action: string;
    description: string;
  }) {
    return this.prisma.ticketActivity.create({
      data,
    });
  }

  async findByTicket(ticketId: string, organizationId: string) {
    return this.prisma.ticketActivity.findMany({
      where: {
        ticketId,
        organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
            avatar: true,
          },
        },
      },
    });
  }
}
