import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { CustomerService } from '../services/customer.service';
import { CreateCustomerDto } from '../dto/create-customer.dto';
import { UpdateCustomerDto } from '../dto/update-customer.dto';

import { JwtAuthGuard } from '../../auth/guards/jwt-auth.guard';

import { CurrentUser } from '../../../common/decorators/current-user.decorator';
import type { CurrentUser as CurrentUserType } from '../../../common/interfaces/current-user.interface';

import { successResponse } from '../../../common/utils/api-response.util';

@UseGuards(JwtAuthGuard)
@Controller('customers')
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post()
  async create(
    @Body() dto: CreateCustomerDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    const customer = await this.customerService.create(
      dto,
      user.organizationId,
    );

    return successResponse(customer, 'Customer created successfully');
  }

  @Get()
  async findAll(@CurrentUser() user: CurrentUserType) {
    const customers = await this.customerService.findAll(user.organizationId);

    return successResponse(customers, 'Customers retrieved successfully');
  }

  @Get(':id')
  async findById(
    @Param('id') id: string,
    @CurrentUser() user: CurrentUserType,
  ) {
    const customer = await this.customerService.findById(
      id,
      user.organizationId,
    );

    return successResponse(customer, 'Customer retrieved successfully');
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() dto: UpdateCustomerDto,
    @CurrentUser() user: CurrentUserType,
  ) {
    const customer = await this.customerService.update(
      id,
      user.organizationId,
      dto,
    );

    return successResponse(customer, 'Customer updated successfully');
  }

  @Delete(':id')
  async remove(@Param('id') id: string, @CurrentUser() user: CurrentUserType) {
    const customer = await this.customerService.remove(id, user.organizationId);

    return successResponse(customer, 'Customer removed successfully');
  }
}
