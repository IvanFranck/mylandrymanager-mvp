/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { Service, ServiceVersion } from '@prisma/client';
import { CustomResponseInterface } from '@common-app-backend/interfaces/response.interface';
import { AccessTokenValidatedRequestInterface } from '@common-app-backend/interfaces/access-token-validated-request.interface';
import { ServiceEntity } from './entities/service.entity';

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
  ): Promise<CustomResponseInterface<ServiceVersion>> {
    const id = request.user.sub;
    try {
      const serviceVersion = await this.prisma.$transaction(async (tx) => {
        // create new service row with fake currentversion id
        const newService = await tx.service.create({
          data: {
            currentVersionId: 1,
            user: {
              connect: {
                id: id,
              },
            },
          },
        });

        // create a service version and connect it to the new service
        const serviceVersion = await tx.serviceVersion.create({
          data: {
            ...createServiceDto,
            service: {
              connect: {
                id: newService.id,
              },
            },
          },
        });

        // update the servcive created by setting the right currentversion id
        return tx.service.update({
          where: {
            id: newService.id,
          },
          data: {
            currentVersionId: serviceVersion.id,
          },
          select: {
            versions: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
          },
        });
      });
      return {
        message: 'service créé!',
        details: serviceVersion.versions[0],
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
  ): Promise<CustomResponseInterface<ServiceEntity[]>> {
    const userId = request.user.sub;
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id: userId,
        },
        include: {
          services: {
            orderBy: {
              createdAt: 'desc',
            },
            include: {
              versions: {
                orderBy: {
                  createdAt: 'desc',
                },
                take: 1,
              },
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
    name: string,
    request: AccessTokenValidatedRequestInterface,
  ): Promise<CustomResponseInterface<ServiceEntity[]>> {
    try {
      // improve this: it make call to DB to retrieve all customers every time we call this.
      // try to cache the response from DB at the first place
      const services = await this.findAll(request);

      const service = services.details.filter((service) =>
        service.versions[0]?.label
          .trim()
          .toLowerCase()
          .includes(name.trim().toLowerCase()),
      );

      return {
        message: 'services trouvés',
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
          },
        });

        const lastServiceVersion = await tx.serviceVersion.findUnique({
          where: {
            id: service.currentVersionId,
          },
        });

        const {
          createdAt,
          id: lastServiceVersionId,
          serviceId,
          ...lastServiceVersionUsefulData
        } = lastServiceVersion;

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
          },
        });
        const updatedService = await tx.service.update({
          where: {
            id: id,
          },
          data: {
            currentVersionId: newVersion.id,
          },
          select: {
            versions: {
              orderBy: {
                createdAt: 'desc',
              },
              take: 1,
            },
          },
        });
        return updatedService;
      });

      if (!service) {
        throw new NotFoundException('Service not found');
      }
      return {
        message: 'service modifié',
        details: service.versions[0],
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
  async remove(id: number): Promise<CustomResponseInterface<Service>> {
    try {
      const service = await this.prisma.service.delete({
        where: {
          id,
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
