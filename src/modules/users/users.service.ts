import { Injectable } from '@nestjs/common';
import { UsersRepository } from './repositories/users.repository';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async findByEmail(email: string) {
    return this.usersRepository.findByEmail(email);
  }

  async createUser(createUserDto: CreateUserDto) {
    return this.usersRepository.create(createUserDto);
  }

  async findByEmailWithPassword(email: string) {
    return this.usersRepository.findByEmailWithPassword(email);
  }
}
