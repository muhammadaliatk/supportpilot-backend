import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';

@Injectable()
export class OrganizationRepository {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: { name: string; slug: string; timezone?: string }) {
    return this.prisma.organization.create({
      data,
    });
  }

  async findBySlug(slug: string) {
    return this.prisma.organization.findUnique({
      where: {
        slug,
      },
    });
  }

  async findById(id: string) {
    return this.prisma.organization.findUnique({
      where: {
        id,
      },
    });
  }

  async findMembership(userId: string, organizationId: string) {
    return this.prisma.organizationUser.findUnique({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
    });
  }
}
