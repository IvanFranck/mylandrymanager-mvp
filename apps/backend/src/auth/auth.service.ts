import {
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { ValidateUserDto } from './dto/validate-user.dto';
import { PrismaService } from 'src/prisma.service';
import * as bcrypt from 'bcrypt';
import { ValidatedUserEntity } from './entites/validate-user.entity';
import { User } from '@prisma/client';
import { JwtService } from '@nestjs/jwt';
import { JWT_CONSTANT } from './constants';
import { CustomResponseInterface } from '@/common/interfaces/response.interface';
import { RefreshTokenDto } from './dto/refresh-token.dto';
import { JWTDecodedEntity } from './entites/jwt-decoded-payload.entity';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  /**
   * validate user based on phone and password.
   *
   * @param {ValidateUserDto} validateUserDto - the user data to be validated
   * @return {Promise<ValidatedUserEntity | null>} the result of the user validation
   */
  async validateUser(
    validateUserDto: ValidateUserDto,
  ): Promise<ValidatedUserEntity | null> {
    const user = await this.prisma.user.findUnique({
      where: {
        phone: validateUserDto.phone,
      },
    });

    if (!user) {
      throw new UnauthorizedException('invalid credentials');
    }

    const isPaswwordValid = await bcrypt.compare(
      validateUserDto.password,
      user.password,
    );

    if (!isPaswwordValid) {
      throw new UnauthorizedException('invalid credentials');
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  }

  /**
   * Asynchronous function for user login.
   *
   * @param {Omit<User, 'password'>} user - the user object without the password field
   * @return {Promise<CustomResponseInterface<{ accessToken: string; refreshToken: string , user: Omit<User, 'password'>}>>} a promise that resolves to a custom response containing access and refresh tokens
   */
  async login(user: Omit<User, 'password'>): Promise<
    CustomResponseInterface<{
      accessToken: string;
      refreshToken: string;
      user: Omit<User, 'password'>;
    }>
  > {
    const { id, username, phone, signUpCompleted } = user;
    const payload = { sub: id, username, phone, signUpCompleted };

    const [accessToken, refreshToken] = await this.getTokens(payload);

    return {
      message: 'utilisateur connecté',
      details: {
        user,
        accessToken,
        refreshToken,
      },
    };
  }

  /**
   * A function to refresh the token.
   *
   * @param {RefreshTokenDto} refreshTokenDto - the DTO containing the refresh token
   * @return {Promise<CustomResponseInterface<{accessToken: string; refreshToken: string;}>>} a promise that resolves to a custom response containing an access token and a refresh token
   */
  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<
    CustomResponseInterface<{
      accessToken: string;
      refreshToken: string;
    }>
  > {
    try {
      const token: JWTDecodedEntity = await this.jwtService.verifyAsync(
        refreshTokenDto.refreshToken,
        {
          ignoreExpiration: false,
          publicKey: JWT_CONSTANT.PUBLIC_KEY,
        },
      );
      if (token) {
        const [accessToken, refreshToken] = await this.getTokens({
          sub: token.sub,
          username: token.username,
          phone: token.phone,
        });
        return {
          message: 'tokens rafraichis',
          details: {
            accessToken,
            refreshToken,
          },
        };
      } else {
        throw new InternalServerErrorException('token expiré');
      }
    } catch (error) {
      throw error;
    }
  }

  /**
   * Asynchronously retrieves tokens for the given payload.
   *
   * @param {{ sub: number; username: string; phone: number }} payload - the payload containing sub, username, and phone
   * @return {Promise<string[]>} an array of tokens as a promise
   */
  async getTokens(payload: {
    sub: number;
    username: string;
    phone: number;
  }): Promise<string[]> {
    return await Promise.all([
      this.jwtService.signAsync(payload, { expiresIn: '4h' }),
      this.jwtService.signAsync(payload, { expiresIn: '6h' }),
    ]);
  }
}
