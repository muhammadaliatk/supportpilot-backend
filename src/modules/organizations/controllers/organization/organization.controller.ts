import { Body, Controller, Post } from '@nestjs/common';
import { OrganizationService } from '../../services/organization/organization.service';
import { CreateOrganizationDto } from '../../dto/create-organization.dto';
import { UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../../../common/guards/roles.guard';
import { Roles } from '../../../../common/decorators/roles.decorator';
import { OrganizationRole } from '@prisma/client';
import { successResponse } from '../../../../common/utils/api-response.util';
import { CurrentUser } from '../../../../common/decorators/current-user.decorator';
import type { CurrentUser as CurrentUserType } from '../../../../common/interfaces/current-user.interface';
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  @Roles(OrganizationRole.OWNER)
  async create(
    @Body() dto: CreateOrganizationDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    const organization = await this.organizationService.create(dto, user.id);
    return successResponse(organization, 'Organization created successfully');
  }
}
