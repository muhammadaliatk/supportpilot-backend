import { IsEnum, IsUUID } from 'class-validator';
import { OrganizationRole } from '@prisma/client';

export class AddOrganizationMemberDto {
  @IsUUID()
  userId!: string;

  @IsEnum(OrganizationRole)
  role!: OrganizationRole;
}