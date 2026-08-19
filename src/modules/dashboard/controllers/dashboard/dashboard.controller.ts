import { Controller, Get, UseGuards } from '@nestjs/common';

import { DashboardService } from '../../services/dashboard/dashboard.service';

import { CurrentUser } from '../../../auth/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../../auth/guards/jwt-auth.guard';

import type { CurrentUser as CurrentUserType } from '../../../../common/interfaces/current-user.interface';

@Controller('dashboard')
@UseGuards(JwtAuthGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('overview')
  async getOverview(@CurrentUser() user: CurrentUserType) {
    return this.dashboardService.getOverview(user.organizationId);
  }

  @Get('tickets/status')
  async getTicketStatusDistribution(@CurrentUser() user: CurrentUserType) {
    return this.dashboardService.getTicketStatusDistribution(
      user.organizationId,
    );
  }

  @Get('tickets/priority')
  async getTicketPriorityDistribution(@CurrentUser() user: CurrentUserType) {
    return this.dashboardService.getTicketPriorityDistribution(
      user.organizationId,
    );
  }

  @Get('tickets/recent')
  async getRecentTickets(@CurrentUser() user: CurrentUserType) {
    return this.dashboardService.getRecentTickets(user.organizationId);
  }

  @Get('customers')
  async getCustomerStatistics(@CurrentUser() user: CurrentUserType) {
    return this.dashboardService.getCustomerStatistics(user.organizationId);
  }
}
