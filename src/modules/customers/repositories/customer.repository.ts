import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';

@Injectable()
export class CustomerRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: {
    organizationId: string;
    name: string;
    email?: string;
    phone?: string;
    company?: string;
  }) {
    return this.prisma.customer.create({
      data,
    });
  }

  async findAll(organizationId: string) {
    return this.prisma.customer.findMany({
      where: {
        organizationId,
        deletedAt: null,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findById(id: string, organizationId: string) {
    return this.prisma.customer.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
      include: {
        tickets: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });
  }

  async update(
    id: string,
    organizationId: string,
    data: {
      name?: string;
      email?: string;
      phone?: string;
      company?: string;
    },
  ) {
    const customer = await this.prisma.customer.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
    });

    if (!customer) {
      return null;
    }

    return this.prisma.customer.update({
      where: {
        id,
      },
      data,
    });
  }

  async remove(id: string, organizationId: string) {
    const customer = await this.prisma.customer.findFirst({
      where: {
        id,
        organizationId,
        deletedAt: null,
      },
    });

    if (!customer) {
      return null;
    }

    return this.prisma.customer.update({
      where: {
        id,
      },
      data: {
        deletedAt: new Date(),
      },
    });
  }
}
