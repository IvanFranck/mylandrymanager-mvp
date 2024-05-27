import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from 'src/prisma.service';
import { Service } from '@prisma/client';
import { CustomResponseInterface } from '@/common/interfaces/response.interface';
import { AccessTokenValidatedRequestInterface } from '@/common/interfaces/access-token-validated-request.interface';

@Injectable()
export class ServicesService {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * A function to create a new service.
   *
   * @param {CreateServiceDto} createServiceDto The service data
   * @param {AccessTokenValidatedRequestInterface} request The validated request object
   * @return {Promise<CustomResponseInterface<Service>>} The created service
   */
  async create(
    createServiceDto: CreateServiceDto,
    request: AccessTokenValidatedRequestInterface,
  ): Promise<CustomResponseInterface<Service>> {
    const id = request.user.sub;
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: {
          services: {
            create: createServiceDto,
          },
        },
        select: {
          services: {
            orderBy: {
              createdAt: 'desc',
            },
            take: 1,
          },
        },
      });

      return {
        message: 'service créé!',
        details: user.services[0],
      };
    } catch (error) {
      if (error.code === 'P2002') {
        throw new BadRequestException('un service avec ce nom existe déja');
      }
      throw new BadRequestException(error);
    }
  }

  /**
   * A function to find all services.
   *
   * @return {Promise<Service[]>} The list of services found
   */
  async findAll(
    request: AccessTokenValidatedRequestInterface,
  ): Promise<CustomResponseInterface<Service[]>> {
    const userId = request.user.sub;
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          services: true,
        },
      });

      const services = user.services;

      return {
        message: 'liste des services',
        details: services,
      };
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  /**
   * A function to find a service by name.
   *
   * @param {string} name - the name of the service to find
   * @return {Promise<{ message: string, service: Service }>} an object containing a message and the service found
   */
  async findOneByName(
    name: string,
    request: AccessTokenValidatedRequestInterface,
  ): Promise<{ message: string; service: Service }> {
    try {
      const services = await this.findAll(request);

      const service = services.details.find((service) =>
        service.label.includes(name),
      );

      if (!service) {
        throw new NotFoundException('service not found');
      }
      return {
        message: 'service trouvé',
        service,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('error: ', error);
      throw new NotFoundException(error);
    }
  }

  async findOneById(
    id: number,
    request: AccessTokenValidatedRequestInterface,
  ): Promise<CustomResponseInterface<Service>> {
    try {
      const services = await this.findAll(request);

      const service = services.details.find((service) => service.id === id);

      if (!service) {
        throw new NotFoundException('service not found');
      }
      return {
        message: 'service trouvé',
        details: service,
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      console.error('error: ', error);
      throw new NotFoundException(error);
    }
  }

  /**
   * A function to update a service.
   *
   * @param {number} id - description of parameter
   * @param {UpdateServiceDto} updateServiceDto - description of parameter
   * @return {Promise<{ message: string, service: unknown }>} description of return value
   */
  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<{ message: string; service: unknown }> {
    try {
      const service = await this.prisma.service.update({
        where: {
          id,
        },
        data: {
          ...updateServiceDto,
        },
      });

      if (!service) {
        throw new NotFoundException();
      }
      return {
        message: 'service modifié',
        service,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('impossible de trouver ce service');
      }
      console.error('error: ', error);
      throw new BadRequestException(error);
    }
  }

  /**
   * A function to delete a service.
   *
   * @param {number} id - description of parameter
   * @return {Promise<{message: string, service: any}>} description of return value
   */
  async remove(id: number): Promise<{ message: string; service: any }> {
    try {
      const service = await this.prisma.service.delete({
        where: {
          id,
        },
      });
      return {
        message: 'service supprimé',
        service,
      };
    } catch (error) {
      console.error('error: ', error);
      if (error.code === 'P2025') {
        throw new BadRequestException('impossible de trouver ce service');
      }
      throw new BadRequestException(error);
    }
  }
}
