import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateUserDto } from './dto/create-user-dto';
import * as bcrypt from 'bcrypt';
import { CreatedUserEntity } from './entities/created-user.entity';

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
  ): Promise<{ message: string; user: CreatedUserEntity }> {
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

      this.logger.log(user);

      return {
        message: 'user created',
        user,
      };
    } catch (error) {
      console.error('error: ', error);
      if (error.code === 'P2002') {
        throw new BadRequestException(
          'user with this phone number already exists',
        );
      }
      throw new BadRequestException(error);
    }
  }
}
