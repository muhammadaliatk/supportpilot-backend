import { OrganizationRole } from '@prisma/client';

export interface CurrentUser {
  id: string;
  email: string;
  organizationId: string;
  role: OrganizationRole;
}