import {
  Injectable,
  ConflictException,
  NotFoundException,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { OrganizationRepository } from '../../repositories/organization.repository';
import { CreateOrganizationDto } from '../../dto/create-organization.dto';
import { generateSlug } from '../../../../common/utils/slug.util';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { OrganizationRole } from '@prisma/client';
import { AddOrganizationMemberDto } from '../../dto/add-organization-member.dto';

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

  async findMembers(organizationId: string) {
    return this.organizationRepository.findMembers(organizationId);
  }

  async addMember(
    organizationId: string,
    currentUserRole: OrganizationRole,
    dto: AddOrganizationMemberDto,
  ) {
    // Only OWNER and ADMIN can add members
    if (
      currentUserRole !== OrganizationRole.OWNER &&
      currentUserRole !== OrganizationRole.ADMIN
    ) {
      throw new ForbiddenException('You do not have permission to add members');
    }

    if (
      currentUserRole === OrganizationRole.ADMIN &&
      dto.role === OrganizationRole.OWNER
    ) {
      throw new ForbiddenException('ADMIN cannot assign OWNER role');
    }

    // Check user exists
    const user = await this.organizationRepository.findUserById(dto.userId);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if already a member
    const existingMembership = await this.organizationRepository.findMembership(
      dto.userId,
      organizationId,
    );

    if (existingMembership && !existingMembership.deletedAt) {
      throw new ConflictException(
        'User is already a member of this organization',
      );
    }

    // Add member
    return this.organizationRepository.addMember(
      dto.userId,
      organizationId,
      dto.role,
    );
  }
}
