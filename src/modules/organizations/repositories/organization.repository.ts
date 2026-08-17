import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../database/prisma/prisma.service';
import { OrganizationRole, UserStatus } from '@prisma/client';

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

  async findUserById(userId: string) {
    return this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async addMember(
    userId: string,
    organizationId: string,
    role: OrganizationRole,
  ) {
    return this.prisma.organizationUser.create({
      data: {
        userId,
        organizationId,
        role,
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
          },
        },
      },
    });
  }

  async updateMemberRole(
    userId: string,
    organizationId: string,
    role: OrganizationRole,
  ) {
    return this.prisma.organizationUser.update({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      data: {
        role,
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
          },
        },
      },
    });
  }

  async updateMemberStatus(userId: string, status: UserStatus) {
    return this.prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        status,
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        avatar: true,
        status: true,
        updatedAt: true,
      },
    });
  }

  async removeMember(userId: string, organizationId: string) {
    return this.prisma.organizationUser.update({
      where: {
        userId_organizationId: {
          userId,
          organizationId,
        },
      },
      data: {
        deletedAt: new Date(),
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
          },
        },
      },
    });
  }
}
