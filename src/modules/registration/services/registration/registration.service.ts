import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../../../database/prisma/prisma.service';
import { generateSlug } from '../../../../common/utils/slug.util';
import { RegisterUserDto } from '../../dto/register-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class RegistrationService {
  constructor(private readonly prisma: PrismaService) {}

  async register(dto: RegisterUserDto) {
    return this.prisma.$transaction(async (tx) => {
      // 1. Hash password
      const hashedPassword = await bcrypt.hash(dto.password, 10);

      // 2. Create user
      const user = await tx.user.create({
        data: {
          email: dto.email,
          password: hashedPassword,
          firstName: dto.firstName,
          lastName: dto.lastName,
        },
      });

      // 3. Create organization
      const organizationName = `${dto.firstName} ${dto.lastName} Workspace`;

      const organization = await tx.organization.create({
        data: {
          name: organizationName,
          slug: generateSlug(organizationName),
        },
      });

      // 4. Assign OWNER role
      await tx.organizationUser.create({
        data: {
          userId: user.id,
          organizationId: organization.id,
          role: 'OWNER',
        },
      });

      return {
        user,
        organization,
      };
    });
  }
}
