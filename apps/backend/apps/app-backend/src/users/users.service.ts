import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import bcrypt from 'bcrypt';
import { CreatedUserEntity } from './entities/created-user.entity';
import { UserInfosEntity } from './entities/user-infos.entity';
import { CustomResponseInterface } from '@app-backend/common/interfaces/response.interface';
import { UpdateUserDto } from './dto/edit-user-dto';

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
  ): Promise<CustomResponseInterface<CreatedUserEntity>> {
    try {
      const encryptedPassword = await bcrypt.hash(createUserDto.password, 8);

      const user = await this.prisma.user.create({
        data: {
          ...createUserDto,
          password: encryptedPassword,
        },
        select: {
          id: true,
          username: true,
          phone: true,
          createdAt: true,
          updatedAt: true,
        },
      });
      return {
        message: 'user created',
        details: user,
      };
    } catch (error) {
      this.logger.error('error: ', error);
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'user with this phone number already exists',
        );
      }
      console.log(error);
      throw new BadRequestException('numéro de téléphone invalide');
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
          address: true,
        },
      });

      if (!user) {
        throw new BadRequestException('user not found');
      }

      return {
        message: 'user infos',
        details: user,
      };
    } catch (error) {
      this.logger.error('error: ', error);
      throw new BadRequestException('user not found');
    }
  }

  async editUser(
    id: number,
    updateUserDto: UpdateUserDto,
  ): Promise<CustomResponseInterface<UserInfosEntity>> {
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
          address: true,
        },
      });
      return {
        message: 'user updated',
        details: user,
      };
    } catch (error) {
      this.logger.error('error: ', error);
      throw new BadRequestException('user not found');
    }
  }
}
