import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';

import { CustomerRepository } from '../repositories/customer.repository';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

@Injectable()
export class CustomerService {
  constructor(private readonly customerRepository: CustomerRepository) {}

  async create(dto: CreateCustomerDto, organizationId: string) {
    if (dto.email) {
      const customers = await this.customerRepository.findAll(organizationId);

      const exists = customers.some(
        (customer) =>
          customer.email?.toLowerCase() === dto.email?.toLowerCase(),
      );

      if (exists) {
        throw new ConflictException('Customer with this email already exists');
      }
    }

    return this.customerRepository.create({
      organizationId,
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      company: dto.company,
    });
  }

  async findAll(organizationId: string) {
    return this.customerRepository.findAll(organizationId);
  }

  async findById(id: string, organizationId: string) {
    const customer = await this.customerRepository.findById(id, organizationId);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async update(id: string, organizationId: string, dto: UpdateCustomerDto) {
    const customer = await this.customerRepository.update(
      id,
      organizationId,
      dto,
    );

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }

  async remove(id: string, organizationId: string) {
    const customer = await this.customerRepository.remove(id, organizationId);

    if (!customer) {
      throw new NotFoundException('Customer not found');
    }

    return customer;
  }
}
