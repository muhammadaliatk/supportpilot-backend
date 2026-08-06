import { Injectable, ConflictException } from '@nestjs/common';
import { OrganizationRepository } from '../../repositories/organization.repository';
import { CreateOrganizationDto } from '../../dto/create-organization.dto';
import { generateSlug } from '../../../../common/utils/slug.util';

@Injectable()
export class OrganizationService {
  constructor(
    private readonly organizationRepository: OrganizationRepository,
  ) {}

  async create(dto: CreateOrganizationDto) {
    const slug = generateSlug(dto.name);

    const existing = await this.organizationRepository.findBySlug(slug);

    if (existing) {
      throw new ConflictException('Organization already exists');
    }

    return this.organizationRepository.create({
      name: dto.name,
      slug,
      timezone: dto.timezone ?? 'UTC',
    });
  }
}
