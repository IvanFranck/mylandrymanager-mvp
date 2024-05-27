import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from 'src/prisma.service';
import { Customer } from '@prisma/client';
import { NotFoundException } from '@nestjs/common/exceptions';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createCustomerDto: CreateCustomerDto) {
    try {
      const customer = await this.prisma.customer.create({
        data: { ...createCustomerDto },
      });

      return {
        message: 'customer created',
        customer,
      };
    } catch (error) {
      console.error('error: ', error);
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'customer with this phone number already exists',
        );
      }
      throw new BadRequestException(error);
    }
  }

  async findAll(): Promise<Customer[]> {
    try {
      const customers = await this.prisma.customer.findMany();

      if (!customers || customers.length === 0) {
        throw new NotFoundException('any customer found');
      }
      return customers;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('error: ', error);
      throw new NotFoundException(error);
    }
  }

  async findOne(name: string) {
    try {
      // improve this: it make call to DB to retrieve all customers every time we call this.
      // try to cache the response from DB at the first place
      const customers = await this.prisma.customer.findMany();

      const customer = customers.find((customer) =>
        customer.name.includes(name),
      );
      if (!customer) {
        throw new NotFoundException('customer not found');
      }
      return {
        message: 'customer found',
        customer,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('error: ', error);
      throw new NotFoundException(error);
    }
  }

  async update(id: number, updateCustomerDto: UpdateCustomerDto) {
    try {
      const customer = await this.prisma.customer.update({
        where: {
          id,
        },
        data: {
          ...updateCustomerDto,
        },
      });

      if (!customer) {
        throw new NotFoundException();
      }
      return {
        message: 'customer updated',
        customer,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException("can't find any customer with this id");
      }
      console.error('error: ', error);
      throw new BadRequestException(error);
    }
  }

  async remove(id: number) {
    try {
      const customer = await this.prisma.customer.delete({
        where: {
          id,
        },
      });
      return {
        message: 'customer deleted',
        customer,
      };
    } catch (error) {
      console.error('error: ', error);
      if (error.code === 'P2025') {
        throw new BadRequestException("can't find any customer with this id");
      }
      throw new BadRequestException(error);
    }
  }
}
