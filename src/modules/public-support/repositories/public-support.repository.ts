import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';

@Injectable()
export class PublicSupportRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findOrganizationBySlug(slug: string) {
    return this.prisma.organization.findFirst({
      where: {
        slug,
        deletedAt: null,
      },
    });
  }

  async findCustomerByEmail(organizationId: string, email: string) {
    return this.prisma.customer.findFirst({
      where: {
        organizationId,
        deletedAt: null,
        email: {
          equals: email,
          mode: 'insensitive',
        },
      },
    });
  }

  async createCustomer(data: {
    organizationId: string;
    name: string;
    email: string;
    phone?: string;
  }) {
    return this.prisma.customer.create({
      data,
    });
  }

  async createTicket(data: {
    organizationId: string;
    customerId: string;
    subject: string;
    description: string;
  }) {
    return this.prisma.ticket.create({
      data,
    });
  }

  async createActivity(data: {
    ticketId: string;
    organizationId: string;
    description: string;
  }) {
    return this.prisma.ticketActivity.create({
      data: {
        ticketId: data.ticketId,
        organizationId: data.organizationId,
        userId: null,
        action: 'CREATED',
        description: data.description,
      },
    });
  }
}
