import { Body, Controller, Post } from '@nestjs/common';
import { OrganizationService } from '../../services/organization/organization.service';
import { CreateOrganizationDto } from '../../dto/create-organization.dto';

@Controller('organizations')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Post()
  create(@Body() dto: CreateOrganizationDto) {
    return this.organizationService.create(dto);
  }
}
