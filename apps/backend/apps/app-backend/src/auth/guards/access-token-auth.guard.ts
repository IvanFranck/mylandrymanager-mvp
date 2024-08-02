import { AuthGuard } from '@nestjs/passport';
import { ACCESS_TOKEN_STRATEGY_NAME } from '../constants';

export class AccessTokenAuthGuard extends AuthGuard(
  ACCESS_TOKEN_STRATEGY_NAME,
) {}
