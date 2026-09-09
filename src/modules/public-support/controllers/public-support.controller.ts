import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { PublicSupportService } from '../services/public-support.service';
import { CreatePublicTicketDto } from '../dto/create-public-ticket.dto';
import { successResponse } from '../../../common/utils/api-response.util';

@Controller('public/support')
export class PublicSupportController {
  constructor(private readonly publicSupportService: PublicSupportService) {}

  @Get(':slug')
  async getOrganization(@Param('slug') slug: string) {
    const organization = await this.publicSupportService.getOrganization(slug);

    return successResponse(organization, 'Organization retrieved successfully');
  }

  @Post(':slug/tickets')
  async createTicket(
    @Param('slug') slug: string,
    @Body() dto: CreatePublicTicketDto,
  ) {
    const ticket = await this.publicSupportService.createTicket(slug, dto);

    return successResponse(ticket, 'Ticket submitted successfully');
  }
}
