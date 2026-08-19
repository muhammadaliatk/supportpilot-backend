import { Injectable } from '@nestjs/common';

import { PrismaService } from '../../../../database/prisma/prisma.service';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getOverview(organizationId: string) {
    const [
      totalCustomers,
      totalTickets,
      openTickets,
      inProgressTickets,
      resolvedTickets,
      closedTickets,
    ] = await Promise.all([
      this.prisma.customer.count({
        where: {
          organizationId,
        },
      }),

      this.prisma.ticket.count({
        where: {
          organizationId,
        },
      }),

      this.prisma.ticket.count({
        where: {
          organizationId,
          status: 'OPEN',
        },
      }),

      this.prisma.ticket.count({
        where: {
          organizationId,
          status: 'IN_PROGRESS',
        },
      }),

      this.prisma.ticket.count({
        where: {
          organizationId,
          status: 'RESOLVED',
        },
      }),

      this.prisma.ticket.count({
        where: {
          organizationId,
          status: 'CLOSED',
        },
      }),
    ]);

    return {
      customers: {
        total: totalCustomers,
      },

      tickets: {
        total: totalTickets,
        open: openTickets,
        inProgress: inProgressTickets,
        resolved: resolvedTickets,
        closed: closedTickets,
      },
    };
  }

  async getTicketStatusDistribution(organizationId: string) {
    const result = await this.prisma.ticket.groupBy({
      by: ['status'],
      where: {
        organizationId,
      },
      _count: {
        _all: true,
      },
    });

    return result.map((item) => ({
      status: item.status,
      count: item._count._all,
    }));
  }

  async getTicketPriorityDistribution(organizationId: string) {
    const result = await this.prisma.ticket.groupBy({
      by: ['priority'],
      where: {
        organizationId,
      },
      _count: {
        _all: true,
      },
    });

    return result.map((item) => ({
      priority: item.priority,
      count: item._count._all,
    }));
  }

  async getRecentTickets(organizationId: string) {
    return this.prisma.ticket.findMany({
      where: {
        organizationId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 10,
      select: {
        id: true,
        subject: true,
        status: true,
        priority: true,
        createdAt: true,
        updatedAt: true,
        customer: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });
  }

  async getCustomerStatistics(organizationId: string) {
    const total = await this.prisma.customer.count({
      where: {
        organizationId,
      },
    });

    return {
      total,
    };
  }
}
