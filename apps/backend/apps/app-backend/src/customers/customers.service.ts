import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { Customer } from '@prisma/client';
import { NotFoundException } from '@nestjs/common/exceptions';
import { AccessTokenValidatedRequestInterface } from '@common-app-backend/interfaces/access-token-validated-request.interface';
import { CustomResponseInterface } from '@common-app-backend/interfaces/response.interface';

@Injectable()
export class CustomersService {
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createCustomerDto: CreateCustomerDto,
    req: AccessTokenValidatedRequestInterface,
  ): Promise<CustomResponseInterface<Customer>> {
    const userId = req.user.sub;
    createCustomerDto.name = createCustomerDto.name.trim();
    try {
      const customer = await this.prisma.customer.create({
        data: { ...createCustomerDto, user: { connect: { id: userId } } },
      });

      return {
        message: 'client ajouté !',
        details: customer,
      };
    } catch (error) {
      console.error('error: ', error);
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'un client avec ce numéro de téléphone existe déjà, veuillez en choisir un autre',
        );
      }
      throw new BadRequestException(error);
    }
  }

  async findAll(
    request: AccessTokenValidatedRequestInterface,
  ): Promise<CustomResponseInterface<Customer[]>> {
    const userId = request.user.sub;
    try {
      const customers = await this.prisma.customer.findMany({
        where: {
          userId,
        },
      });

      return {
        message: 'liste des clients',
        details: customers,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('error: ', error);
      throw new NotFoundException(error);
    }
  }

  async findOne(name: string): Promise<CustomResponseInterface<Customer[]>> {
    try {
      // improve this: it make call to DB to retrieve all customers every time we call this.
      // try to cache the response from DB at the first place
      const customers = await this.prisma.customer.findMany();

      const customer = customers.filter((customer) =>
        customer.name.toLowerCase().includes(name.trim().toLowerCase()),
      );

      return {
        message: 'clients trouvés',
        details: customer,
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
