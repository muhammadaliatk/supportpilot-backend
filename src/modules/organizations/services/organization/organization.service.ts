import { Injectable, ConflictException } from '@nestjs/common';
import { OrganizationRepository } from '../../repositories/organization.repository';
import { CreateOrganizationDto } from '../../dto/create-organization.dto';
import { generateSlug } from '../../../../common/utils/slug.util';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { ForbiddenException } from '@nestjs/common';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
    private readonly prisma: PrismaService,
  ) {}

  async create(dto: CreateOrganizationDto, userId: string) {
    const slug = generateSlug(dto.name);

    const existing = await this.organizationRepository.findBySlug(slug);

    if (existing) {
      throw new ConflictException('Organization already exists');
    }

    return this.prisma.$transaction(async (tx) => {
      // 1. Create organization
      const organization = await tx.organization.create({
        data: {
          name: dto.name,
          slug,
          timezone: dto.timezone ?? 'UTC',
        },
      });

      // 2. Add current user as OWNER
      await tx.organizationUser.create({
        data: {
          userId,
          organizationId: organization.id,
          role: 'OWNER',
        },
      });

      return organization;
    });
  }

  async verifyMembership(userId: string, organizationId: string) {
    const membership = await this.organizationRepository.findMembership(
      userId,
      organizationId,
    );

    if (!membership) {
      throw new ForbiddenException(
        'You do not have access to this organization',
      );
    }

    return membership;
  }
}
