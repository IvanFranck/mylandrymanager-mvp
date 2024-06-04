import {
  BadRequestException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import { PrismaService } from 'src/prisma.service';
import { Command, ServiceVersion } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { CustomResponseInterface } from '@/common/interfaces/response.interface';
import { AccessTokenValidatedRequestInterface } from '@/common/interfaces/access-token-validated-request.interface';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CommandsService {
  private readonly logger = new Logger(CommandsService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {}

  /**
   * Compute the total price after applying a discount.
   *
   * @param {Array<{service: Service, quantity: number}>} services - the list of services and their quantities
   * @param {number} discount - the discount amount to be applied
   * @return {number} the total price after applying the discount
   */
  private computeTotalPrice(
    services: { service: ServiceVersion; quantity: number }[],
    discount: number | undefined,
  ): number {
    const totalServicesPrice = services.reduce(
      (acc, { service, quantity }) => acc + service.price * quantity,
      0,
    );
    return discount ? totalServicesPrice - discount : totalServicesPrice;
  }

  /**
   * A function to create a command using the provided data.
   *
   * @param {CreateCommandDto} createCommandDto - the data for creating the command
   * @return {Promise<CustomResponseInterface<Command>>} an object containing a message and the created command
   */
  async create(
    createCommandDto: CreateCommandDto,
    request: AccessTokenValidatedRequestInterface,
  ): Promise<CustomResponseInterface<Command>> {
    const { description, discount, customerId, services, withdrawDate } =
      createCommandDto;
    const userId = request.user.sub;
    try {
      const code = uuidv4();
      // 1. compute the total price
      const totalPrice = this.computeTotalPrice(services, discount);

      // 2. create the command and connect to customer
      const command = await this.prisma.command.create({
        data: {
          price: totalPrice,
          description: description,
          discount: discount,
          code: code,
          withdrawDate: withdrawDate,
          customer: {
            connect: {
              id: customerId,
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
          // 3. create all serviceoncommands entries and connect them to the created command
          services: {
            create: services.map((service) => ({
              service: {
                connect: {
                  id: service.service.id,
                },
              },
              quantity: service.quantity,
            })),
          },
        },
        select: {
          createdAt: true,
          updatedAt: true,
          id: true,
          price: true,
          description: true,
          discount: true,
          customerId: true,
          userId: true,
          withdrawDate: true,
          customer: true,
          code: true,
          advance: true,
          status: true,
          services: {
            select: {
              service: true,
              quantity: true,
              serviceId: false,
              commandId: false,
            },
          },
        },
      });

      return {
        message: 'commande ajoutée',
        details: command,
      };
    } catch (error) {
      this.logger.log(error);
      throw new BadRequestException(error);
    }
  }

  /**
   * Find all commands.
   *
   * @param {void} - no parameters
   * @return {Promise<Command[]>} the found commands
   */
  async findAll(
    request: AccessTokenValidatedRequestInterface,
  ): Promise<CustomResponseInterface<Command[]>> {
    const userId = request.user.sub;
    try {
      const commands = await this.prisma.command.findMany({
        where: {
          userId,
        },
        include: {
          customer: true,
          services: {
            select: {
              service: true,
              quantity: true,
              serviceId: false,
              commandId: false,
            },
          },
        },
      });

      return {
        message: 'liste des commandes',
        details: commands,
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
   * Find a specific item by its ID.
   *
   * @param {number} id - The ID of the item to find
   * @return {Promise<{ message: string, command: any }>} An object containing a message and the found command
   */
  async findOne(id: number): Promise<CustomResponseInterface<Command>> {
    try {
      const command = await this.prisma.command.findUnique({
        where: {
          id,
        },
        include: {
          customer: true,
          services: {
            select: {
              service: true,
              quantity: true,
            },
          },
        },
      });

      return {
        message: 'commande trouvée',
        details: command,
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
   * update command with given id and updateCommandDto
   *
   * @param {number} id - the id of the command to update
   * @param {UpdateCommandDto} updateCommandDto - the data to update the command with
   * @return {Promise<{message: string, command: any}>} the updated command and a message
   */
  async update(
    id: number,
    updateCommandDto: UpdateCommandDto,
  ): Promise<{ message: string; command: any }> {
    const { description, discount, customerId, services } = updateCommandDto;
    try {
      let totalPrice: number | undefined = undefined;

      if (services) {
        totalPrice = this.computeTotalPrice(services, discount);
      }

      const command = await this.prisma.command.update({
        where: {
          id,
        },
        data: {
          price: totalPrice,
          description,
          discount,
          customer: {
            connect: { id: customerId },
          },
          services: {
            deleteMany: {},
            create: services.map((service) => ({
              quantity: service.quantity,
              service: {
                connect: {
                  id: service.service.id,
                },
              },
            })),
          },
        },
        include: {
          customer: true,
          services: true,
        },
      });

      return {
        message: 'command updated',
        command,
      };
    } catch (error) {
      if (error.code === 'P2025') {
        throw new NotFoundException("can't find any command with this id");
      }

      console.error('error: ', error);
      throw new BadRequestException(error);
    }
  }

  /**
   * delete command with given id
   *
   * @param {number} id - description of parameter
   * @return {Promise<{ message: string, command: any }>} description of return value
   */
  async remove(id: number): Promise<{ message: string; command: any }> {
    //fix the serviceoncommand constraint
    try {
      const command = await this.prisma.command.delete({
        where: {
          id,
        },
      });

      return {
        message: 'command deleted',
        command,
      };
    } catch (error) {
      console.error('error: ', error);
      if (error.code === 'P2025') {
        throw new BadRequestException("can't find any command with this id");
      }
      throw new BadRequestException(error);
    }
  }

  /**
   * Generates a random command code using the configured character set.
   *
   * @return {string} The randomly generated command code.
   */
  private generateCommandeCode(): string {
    const char_set = this.configService.get<string>('COMMAND_CODE_ALPHABET');
    const n = char_set.length;
    let random_string = '';

    for (let i = 0; i < 8; i++) {
      random_string += char_set[Math.floor(Math.random() * n)];
    }

    return random_string;
  }
}
