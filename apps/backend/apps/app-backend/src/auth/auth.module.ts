import { Module } from '@nestjs/common';
import { PrismaService } from '@app/prisma/prisma.service';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { LocalStrategy } from './strategies/local.strategy';
import { AuthController } from './auth.controller';
import { JwtModule } from '@nestjs/jwt';
import { AccessTokenStrategy } from './strategies/access-token-strategy';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtKeysModule } from '@app-backend/jwtkeys/jwtkeys.module';
import { JwtKeysService } from '@app-backend/jwtkeys/jwtkeys.service';

@Module({
  imports: [
    PassportModule,
    JwtModule.registerAsync({
      imports: [ConfigModule, JwtKeysModule],
      useFactory: async (
        configService: ConfigService,
        jwtKeysService: JwtKeysService,
      ) => {
        return {
          privateKey: jwtKeysService.privateKey,
          publicKey: jwtKeysService.publicKey,
          signOptions: { algorithm: configService.get('JWT_ALGORITHM') },
        };
      },
      inject: [ConfigService, JwtKeysService],
    }),
  ],
  controllers: [AuthController],
  providers: [
    PrismaService,
    AuthService,
    LocalStrategy,
    AccessTokenStrategy,
    JwtKeysService,
  ],
  exports: [AccessTokenStrategy],
})
export class AuthModule {}
