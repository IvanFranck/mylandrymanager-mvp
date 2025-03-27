import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import bcrypt from 'bcrypt';
import { UserInfosEntity } from './entities/user-infos.entity';
import { CustomResponseInterface } from '@app-backend/common/interfaces/response.interface';
import { UpdateUserDto } from './dto/edit-user-dto';
import { UserAgentEntity } from './entities/use-agent.entity';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name);
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Asynchronous function to create a user.
   *
   * @param {CreateUserDto} createUserDto - the data to create a new user
   * @return {Promise<{message: string, user: CreatedUserEntity}>} an object containing a message and the created user
   */

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<CustomResponseInterface<UserAgentEntity>> {
    try {
      const encryptedPassword = await bcrypt.hash(createUserDto.password, 8);

      const user = await this.prisma.$transaction(async (tx) => {
        const { agency_name, agency_address, agency_contact, username, phone } =
          createUserDto;
        const newUser = await tx.user.create({
          data: {
            username,
            phone,
            password: encryptedPassword,
          },
        });
        if (newUser) {
          const newAgency = await tx.agency.create({
            data: {
              address: agency_address,
              phone: agency_contact,
              name: agency_name,
              owner: {
                connect: {
                  id: newUser.id,
                },
              },
            },
          });

          if (newAgency) {
            return await tx.userAgency.create({
              data: {
                role: 'OWNER',
                user: {
                  connect: {
                    id: newUser.id,
                  },
                },
                agency: {
                  connect: {
                    id: newAgency.id,
                  },
                },
              },
              select: {
                userId: true,
                agencyId: true,
                createdAt: true,
                user: {
                  select: {
                    username: true,
                    phone: true,
                  },
                },
                agency: {
                  select: {
                    name: true,
                    address: true,
                    phone: true,
                  },
                },
              },
            });
          }
          throw new BadRequestException(
            "erreur lors de la création de l'agence",
          );
        }
        throw new BadRequestException("erreur lors de la création de l'agence");
      });
      return {
        message: 'utilisateur créé avec succès',
        details: user,
      };
    } catch (error) {
      this.logger.error('error: ', error);
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'Un utilisateur avec ce numéro existe déjà. Veillez utiliser un autre numéro',
        );
      }
      console.log(error);
      throw new BadRequestException(
        "erreur lors de la création de l'utilisateur",
      );
    }
  }

  async getUserInfos(
    id: number,
  ): Promise<CustomResponseInterface<UserInfosEntity>> {
    try {
      const user = await this.prisma.user.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          username: true,
          phone: true,
          ownedAgencies: true,
          agencyMemberships: true,
        },
      });

      if (!user) {
        throw new BadRequestException({
          message: 'user not found',
        });
      }

      return {
        message: 'user infos',
        details: user,
      };
    } catch (error) {
      this.logger.error('error: ', error);
      throw new BadRequestException({
        message: 'an error occurred while getting user infos',
      });
    }
  }

  async editUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<CustomResponseInterface<UserInfosEntity>> {
    this.logger.log(`user id: ${id}`);
    try {
      const user = await this.prisma.user.update({
        where: {
          id,
        },
        data: updateUserDto,
        select: {
          id: true,
          username: true,
          phone: true,
          agencyMemberships: true,
        },
      });
      if (!user) {
        throw new BadRequestException('user not found');
      }
      return {
        message: 'user updated',
        details: user,
      };
    } catch (error) {
      console.error('error: ', error);
      throw new BadRequestException('an error occurred while updating user');
    }
  }
}
