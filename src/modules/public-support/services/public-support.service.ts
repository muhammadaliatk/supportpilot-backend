import { Injectable, NotFoundException } from '@nestjs/common';

import { PublicSupportRepository } from '../repositories/public-support.repository';
import { CreatePublicTicketDto } from '../dto/create-public-ticket.dto';

@Injectable()
export class PublicSupportService {
  constructor(private readonly publicSupportRepository: PublicSupportRepository) {}

  async getOrganization(slug: string) {
    const organization = await this.findActiveOrganization(slug);

    return {
      name: organization.name,
      logo: organization.logo,
    };
  }

  async createTicket(slug: string, dto: CreatePublicTicketDto) {
    const organization = await this.findActiveOrganization(slug);

    let customer = await this.publicSupportRepository.findCustomerByEmail(
      organization.id,
      dto.email,
    );

    if (!customer) {
      customer = await this.publicSupportRepository.createCustomer({
        organizationId: organization.id,
        name: dto.name,
        email: dto.email,
        phone: dto.phone,
      });
    }

    const ticket = await this.publicSupportRepository.createTicket({
      organizationId: organization.id,
      customerId: customer.id,
      subject: dto.subject,
      description: dto.description,
    });

    await this.publicSupportRepository.createActivity({
      ticketId: ticket.id,
      organizationId: organization.id,
      description: `Ticket "${ticket.subject}" was submitted by ${dto.name} (customer)`,
    });

    return {
      id: ticket.id,
      subject: ticket.subject,
      status: ticket.status,
      priority: ticket.priority,
      createdAt: ticket.createdAt,
    };
  }

  private async findActiveOrganization(slug: string) {
    const organization = await this.publicSupportRepository.findOrganizationBySlug(slug);

    if (!organization || organization.status !== 'ACTIVE') {
      throw new NotFoundException('Support page not found');
    }

    return organization;
  }
}
