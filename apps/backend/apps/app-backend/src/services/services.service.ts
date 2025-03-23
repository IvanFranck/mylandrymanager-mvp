/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { Service, ServiceVersion } from '@prisma/client';
import { CustomResponseInterface } from '@common-app-backend/interfaces/response.interface';
import { ServiceEntity } from './entities/service.entity';
import { SearchByNameQueriesType } from '@app-backend/common/queries.type';

@Injectable()
export class ServicesService {
  private readonly logger = new Logger(ServicesService.name);
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
  ): Promise<CustomResponseInterface<ServiceVersion>> {
    try {
      const { agencyId, ...serviceData } = createServiceDto;
      const service = await this.prisma.$transaction(async (tx) => {
        // create new service version an parent service
        const serviceVersion = await tx.serviceVersion.create({
          data: {
            ...serviceData,
            service: {
              create: {
                Agency: {
                  connect: {
                    id: agencyId,
                  },
                },
              },
            },
          },
          select: {
            id: true,
            service: true,
          },
        });

        // update the service created by setting the right currentversion id

        return await tx.service.update({
          where: {
            id: serviceVersion.service.id,
          },
          data: {
            currentVersion: {
              connect: {
                id: serviceVersion.id,
              },
            },
          },
          select: {
            currentVersion: true,
          },
        });
      });
      return {
        message: 'service créé!',
        details: service.currentVersion,
      };
    } catch (error) {
      this.logger.error('error: ', error);
      if (error.code === 'P2002') {
        throw new BadRequestException('un service avec ce nom existe déja');
      }
      if (error instanceof HttpException) {
        throw error;
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
    agencyId: number,
  ): Promise<CustomResponseInterface<ServiceEntity[]>> {
    try {
      const user = await this.prisma.agency.findUnique({
        where: {
          id: agencyId,
        },
        include: {
          services: {
            where: {
              isDeleted: false,
            },
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              currentVersion: true,
            },
          },
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
    query: SearchByNameQueriesType,
  ): Promise<CustomResponseInterface<ServiceEntity[]>> {
    try {
      const services = await this.prisma.service.findMany({
        where: {
          agencyId: query.agencyId,
          isDeleted: false,
          currentVersion: {
            label: {
              contains: query.name,
              mode: 'insensitive',
            },
          },
        },
        include: {
          currentVersion: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 10,
      });

      return {
        message: 'services trouvés',
        details: services,
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
    agencyId: number,
  ): Promise<CustomResponseInterface<Service>> {
    try {
      const services = await this.findAll(agencyId);

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
      if (error instanceof HttpException) {
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
   * @return {Promise<CustomResponseInterface<ServiceVersion>>} description of return value
   */
  async update(
    id: number,
    updateServiceDto: UpdateServiceDto,
  ): Promise<CustomResponseInterface<ServiceVersion>> {
    try {
      const service = await this.prisma.$transaction(async (tx) => {
        const service = await tx.service.findUnique({
          where: {
            id: id,
            isDeleted: false,
          },
          select: {
            currentVersion: true,
          },
        });

        if (!service) {
          throw new NotFoundException('Service inexistant ou supprimé');
        }

        const {
          createdAt,
          id: lastServiceVersionId,
          serviceId,
          ...lastServiceVersionUsefulData
        } = service.currentVersion;

        const newServiceVersion = {
          ...lastServiceVersionUsefulData,
          ...updateServiceDto,
        };
        const newVersion = await tx.serviceVersion.create({
          data: {
            ...newServiceVersion,
            service: {
              connect: {
                id: id,
              },
            },
            serviceAsCurrent: {
              connect: {
                id: id,
              },
            },
          },
        });
        const updatedService = await tx.service.update({
          where: {
            id: id,
          },
          data: {
            currentVersion: {
              connect: {
                id: newVersion.id,
              },
            },
          },
          select: {
            currentVersion: true,
          },
        });
        return updatedService;
      });

      if (!service) {
        throw new NotFoundException('Service not found');
      }
      return {
        message: 'service modifié',
        details: service.currentVersion,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new BadRequestException('impossible de trouver ce service');
      }
      if (error instanceof HttpException) {
        throw error;
      }
      throw new BadRequestException(error);
    }
  }

  /**
   * A function to delete a service.
   *
   * @param {number} id - description of parameter
   * @return {Promise<{message: string, service: any}>} description of return value
   */
  async remove(id: number): Promise<CustomResponseInterface<Service>> {
    try {
      const service = await this.prisma.service.update({
        where: {
          id,
        },
        data: {
          isDeleted: true,
        },
      });
      return {
        message: 'service supprimé',
        details: service,
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
