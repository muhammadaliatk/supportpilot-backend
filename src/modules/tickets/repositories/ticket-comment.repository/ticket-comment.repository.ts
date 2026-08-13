import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';

@Injectable()
export class TicketCommentRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { ticketId: string; userId: string; message: string }) {
    return await this.prisma.ticketComment.create({
      data,
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });
  }

  async findAll(ticketId: string) {
    return await this.prisma.ticketComment.findMany({
      where: {
        ticketId,
      },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });
  }
}
