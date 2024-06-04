import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_TOKEN_STRATEGY_NAME } from '../constants';
import { Injectable } from '@nestjs/common';
import { JWTDecodedEntity } from '../entites/jwt-decoded-payload.entity';
import { JwtKeysService } from '../../jwtkeys/jwtkeys.service';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  ACCESS_TOKEN_STRATEGY_NAME,
) {
  constructor(private readonly jwtKeysService: JwtKeysService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtKeysService.publicKey,
    });
  }

  async validate(payload: JWTDecodedEntity) {
    const { sub, phone, username } = payload;
    return { sub, phone, username };
  }
}
