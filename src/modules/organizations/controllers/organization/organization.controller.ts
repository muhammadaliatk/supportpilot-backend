import {
  Body,
  Controller,
  Delete,
  Post,
  Get,
  Patch,
  Param,
} from '@nestjs/common';
import { OrganizationService } from '../../services/organization/organization.service';
import { CreateOrganizationDto } from '../../dto/create-organization.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { successResponse } from '../../../../common/utils/api-response.util';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import type { CurrentUser as CurrentUserType } from '../../../../common/interfaces/current-user.interface';
import { PrismaService } from 'src/database/prisma/prisma.service';
import { AddOrganizationMemberDto } from '../../dto/add-organization-member.dto';
import { UpdateMemberRoleDto } from '../../dto/update-member-role.dto';
import { UpdateMemberStatusDto } from '../../dto/update-member-status.dto';
import {
  Prisma,
  TicketPriority,
  TicketStatus,
  OrganizationRole,
} from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('organizations')
export class OrganizationController {
  constructor(
    private readonly organizationService: OrganizationService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  @Roles(OrganizationRole.OWNER)
  async create(
    @Body() dto: CreateOrganizationDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    const organization = await this.organizationService.create(dto, user.id);
    return successResponse(organization, 'Organization created successfully');
  }

  @Get('members')
  async findMembers(@CurrentUser() user: CurrentUserType) {
    const members = await this.organizationService.findMembers(
      user.organizationId,
    );

    return successResponse(
      members,
      'Organization members retrieved successfully',
    );
  }

  @Post('members')
  @Roles(OrganizationRole.OWNER, OrganizationRole.ADMIN)
  async addMember(
    @Body() dto: AddOrganizationMemberDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    const member = await this.organizationService.addMember(
      user.organizationId,
      user.role,
      dto,
    );

    return successResponse(member, 'Organization member added successfully');
  }

  @Patch('members/:userId/role')
  async updateMemberRole(
    @Param('userId') targetUserId: string,
    @Body() dto: UpdateMemberRoleDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    const member = await this.organizationService.updateMemberRole(
      user.organizationId,
      user.id,
      user.role,
      targetUserId,
      dto.role,
    );

    return successResponse(
      member,
      'Organization member role updated successfully',
    );
  }

  @Patch('members/:userId/status')
  @Roles(OrganizationRole.OWNER, OrganizationRole.ADMIN)
  async updateMemberStatus(
    @Param('userId') targetUserId: string,
    @Body() dto: UpdateMemberStatusDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    const member = await this.organizationService.updateMemberStatus(
      user.organizationId,
      user.role,
      targetUserId,
      dto.status,
    );

    return successResponse(
      member,
      'Organization member status updated successfully',
    );
  }

  @Delete('members/:userId')
  @Roles(OrganizationRole.OWNER, OrganizationRole.ADMIN)
  async removeMember(
    @Param('userId') targetUserId: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    const member = await this.organizationService.removeMember(
      user.organizationId,
      user.id,
      user.role,
      targetUserId,
    );

    return successResponse(member, 'Organization member removed successfully');
  }

  async getStats(organizationId: string) {
    const [total, open, inProgress, resolved, closed, urgent] =
      await this.prisma.$transaction([
        this.prisma.ticket.count({
          where: {
            organizationId,
          },
        }),

        this.prisma.ticket.count({
          where: {
            organizationId,
            status: TicketStatus.OPEN,
          },
        }),

        this.prisma.ticket.count({
          where: {
            organizationId,
            status: TicketStatus.IN_PROGRESS,
          },
        }),

        this.prisma.ticket.count({
          where: {
            organizationId,
            status: TicketStatus.RESOLVED,
          },
        }),

        this.prisma.ticket.count({
          where: {
            organizationId,
            status: TicketStatus.CLOSED,
          },
        }),

        this.prisma.ticket.count({
          where: {
            organizationId,
            priority: TicketPriority.URGENT,
          },
        }),
      ]);

    return {
      total,
      open,
      inProgress,
      resolved,
      closed,
      urgent,
    };
  }
}
