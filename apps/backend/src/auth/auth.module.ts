import { Module } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { JWT_CONSTANT } from './constants';
import { AccessTokenStrategy } from './strategies/access-token-strategy';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      privateKey: JWT_CONSTANT.PRIVATE_KEY,
      publicKey: JWT_CONSTANT.PUBLIC_KEY,
      signOptions: { algorithm: 'RS256' },
    }),
  ],
  controllers: [AuthController],
  providers: [PrismaService, AuthService, LocalStrategy, AccessTokenStrategy],
  exports: [AccessTokenStrategy],
})
export class AuthModule {}
