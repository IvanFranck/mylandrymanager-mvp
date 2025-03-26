import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { Customer } from '@prisma/client';
import { HttpException, NotFoundException } from '@nestjs/common/exceptions';
import { CustomResponseInterface } from '@common-app-backend/interfaces/response.interface';
import {
  GenericQueryType,
  SearchByNameQueriesType,
} from '@app-backend/common/queries.type';

@Injectable()
export class CustomersService {
  private readonly logger = new Logger(CustomersService.name);
  constructor(private readonly prisma: PrismaService) {}
  async create(
    createCustomerDto: CreateCustomerDto,
  ): Promise<CustomResponseInterface<Customer>> {
    const { agencyId, ...payload } = createCustomerDto;
    try {
      const customer = await this.prisma.customer.create({
        data: { ...payload, Agency: { connect: { id: agencyId } } },
      });

      return {
        message: 'client ajouté !',
        details: customer,
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'un client avec ce numéro de téléphone existe déjà, veuillez en choisir un autre',
        );
      }
      throw new BadRequestException(
        'Les informations saisies ne sont pas valides',
      );
    }
  }

  async findAll(
    query: GenericQueryType,
  ): Promise<CustomResponseInterface<Customer[]>> {
    try {
      const customers = await this.prisma.customer.findMany({
        where: {
          agencyId: query.agencyId,
        },
        take: query.limit,
        orderBy: { createdAt: 'desc' },
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

  async searchByName(
    query: SearchByNameQueriesType,
  ): Promise<CustomResponseInterface<Customer[]>> {
    try {
      if (query.name.trim().length === 0) {
        throw new BadRequestException('Veillez renseigner un nom');
      }
      const customers = await this.prisma.customer.findMany({
        where: {
          name: {
            contains: query.name,
            mode: 'insensitive',
          },
          agencyId: query.agencyId,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      if (!customers) {
        throw new NotFoundException('client non trouvé');
      }

      return {
        message: 'clients trouvés',
        details: customers,
      };
    } catch (error) {
      this.logger.error(error);
      if (error instanceof HttpException) {
        throw error;
      }
      console.error('error: ', error);
      throw new NotFoundException(error);
    }
  }

  async findOneById(id: number): Promise<CustomResponseInterface<Customer>> {
    try {
      const customer = await this.prisma.customer.findUnique({
        where: {
          id,
        },
      });

      if (!customer) {
        throw new NotFoundException('client non trouvé');
      }

      return {
        message: 'client trouvé',
        details: customer,
      };
    } catch (error) {
      if (error instanceof HttpException) {
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
        throw new NotFoundException('client non trouvé');
      }
      return {
        message: 'customer updated',
        customer,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('Client non trouvé');
      }
      if (error instanceof HttpException) {
        throw error;
      }
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
