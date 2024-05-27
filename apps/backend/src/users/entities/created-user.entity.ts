import { OmitType } from '@nestjs/mapped-types';
import { UserEntity } from './user.entity';

export class CreatedUserEntity extends OmitType(UserEntity, [
  'password',
  'signUpCompleted',
] as const) {}
