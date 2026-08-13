import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { PrismaService } from '../../database/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly prisma: PrismaService,
  ) {}

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async createUser(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  async findByEmailWithPassword(email: string) {
    return await this.prisma.user.findUnique({
      where: {
        email,
      },
      include: {
        organizations: {
          select: {
            organizationId: true,
            role: true,
          },
        },
      },
    });
  }

  async findByIdInOrganization(userId: string, organizationId: string) {
    return this.prisma.user.findFirst({
      where: {
        id: userId,
        organizations: {
          some: {
            organizationId,
          },
        },
      },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        status: true,
      },
    });
  }
}
