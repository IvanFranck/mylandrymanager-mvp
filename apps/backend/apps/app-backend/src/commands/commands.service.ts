import {
  BadRequestException,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import { PrismaService } from '@app/prisma/prisma.service';
import { Command, CommandStatus } from '@prisma/client';
import { ConfigService } from '@nestjs/config';
import { CustomResponseInterface } from '@common-app-backend/interfaces/response.interface';
import { AccessTokenValidatedRequestInterface } from '@common-app-backend/interfaces/access-token-validated-request.interface';
import Hashids from 'hashids';
import { computeTotalPartial } from '../common/utils/priceProcessing';
import { InvoicesService } from '@app-backend/invoices/invoices.service';
import { CommandQueriesType } from '@common-app-backend/queries.type';
import {
  INCOMES_STATS_SERVICE,
  HANDLE_COMMAND_EVENT,
} from '@app/event-patterns';
import { ClientProxy } from '@nestjs/microservices';
import { lastValueFrom } from 'rxjs';

@Injectable()
export class CommandsService {
  private readonly logger = new Logger(CommandsService.name);
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly invoiceService: InvoicesService,
    @Inject(INCOMES_STATS_SERVICE) private incomesServiceClient: ClientProxy,
  ) {}

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
    const {
      description,
      discount,
      customerId,
      services,
      withdrawDate,
      advance,
    } = createCommandDto;
    const userId = request.user.sub;
    const hashIds = new Hashids(
      this.configService.get('CODE_SALT'),
      Number(this.configService.get('CODE_MIN_LENGTH')),
      this.configService.get('CODE_ALPHABET'),
    );
    try {
      // 1. compute the total price
      const totalPrice = computeTotalPartial(services);

      if (advance > totalPrice - discount) {
        throw new BadRequestException(
          "Le montant de l'avance est supérieur au total à payer",
        );
      }

      const commandStatus = this.getCommandStatus(
        totalPrice,
        advance,
        discount,
      );

      // 2. create the command and connect to customer
      const command = await this.prisma.$transaction(async (tx) => {
        const newCommand = await tx.command.create({
          data: {
            price: totalPrice,
            description: description,
            discount: discount,
            withdrawDate: withdrawDate,
            advance,
            status: commandStatus,
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
                    id: service.service.currentVersionId,
                  },
                },
                quantity: service.quantity,
              })),
            },
          },
        });

        const code = hashIds.encode(newCommand.id);

        return await tx.command.update({
          where: {
            id: newCommand.id,
          },
          data: {
            code,
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
      });

      await lastValueFrom(
        this.incomesServiceClient.emit(HANDLE_COMMAND_EVENT, command),
      ).catch((error) => {
        console.log(`error when send ${HANDLE_COMMAND_EVENT}`, error);
      });

      //generate the related invoice
      await this.invoiceService.createInvoice({
        commandId: command.id,
        advance: advance,
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
    queries: CommandQueriesType,
  ): Promise<CustomResponseInterface<Command[]>> {
    const userId = request.user.sub;
    const { status, createdAt, from, to } = queries;
    console.log('queries', queries);
    try {
      const commands = await this.prisma.command.findMany({
        where: {
          userId,
          status,
          createdAt,
          withdrawDate:
            from && to
              ? {
                  lte: new Date(to),
                  gte: new Date(from),
                }
              : undefined,
        },
        orderBy: {
          createdAt: 'desc',
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
    const { description, advance } = updateCommandDto;
    try {
      const command = await this.prisma.$transaction(async (tx) => {
        const command = await tx.command.findUnique({
          where: {
            id,
          },
        });

        if (command.advance + advance > command.price) {
          throw new BadRequestException(
            'Le montant entré est supérieur au reste à payer',
          );
        }
        const commandStatus = this.getCommandStatus(
          command.price,
          command.advance + advance,
          command.discount,
        );

        const updatedCommand = await tx.command.update({
          where: {
            id,
          },
          data: {
            description,
            status: commandStatus,
            advance: {
              increment: advance,
            },
          },
          include: {
            customer: true,
            services: true,
          },
        });

        return updatedCommand;
      });

      if (advance > 0) {
        //send an event to the incomes service
        await lastValueFrom(
          this.incomesServiceClient.emit<Command>(HANDLE_COMMAND_EVENT, {
            ...command,
            advance,
          }),
        ).catch((error) => {
          console.log(`error when send ${HANDLE_COMMAND_EVENT}`, error);
        });
      }

      //generate the related invoice
      await this.invoiceService.createInvoice({
        commandId: command.id,
        advance: advance,
      });

      return {
        message: 'commande mise à jour',
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

  private getCommandStatus(
    totalprice: number,
    advance: number,
    discount: number,
  ): CommandStatus {
    console.log('getCommandStatus', totalprice, advance, discount);
    if (advance === 0) {
      return 'NOT_PAID';
    } else if (totalprice - discount > advance) {
      return 'PENDING';
    } else {
      return 'PAID';
    }
  }
}
