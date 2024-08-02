import { OmitType } from '@nestjs/mapped-types';
import { UserEntity } from '@app-backend/users/entities/user.entity';

export class ValidatedUserEntity extends OmitType(UserEntity, [
  'password',
] as const) {}
