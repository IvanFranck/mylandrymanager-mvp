import { JWTDecodedEntity } from '@app-backend/auth/entites/jwt-decoded-payload.entity';
import { Request } from 'express';

export interface AccessTokenValidatedRequestInterface extends Request {
  user: Pick<JWTDecodedEntity, 'username' | 'phone' | 'sub'>;
}
