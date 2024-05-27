import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ACCESS_TOKEN_STRATEGY_NAME, JWT_CONSTANT } from '../constants';
import { Injectable } from '@nestjs/common';
import { JWTDecodedEntity } from '../entites/jwt-decoded-payload.entity';

@Injectable()
export class AccessTokenStrategy extends PassportStrategy(
  Strategy,
  ACCESS_TOKEN_STRATEGY_NAME,
) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: JWT_CONSTANT.PUBLIC_KEY,
    });
  }

  async validate(payload: JWTDecodedEntity) {
    const { sub, phone, username } = payload;
    return { sub, phone, username };
  }
}
