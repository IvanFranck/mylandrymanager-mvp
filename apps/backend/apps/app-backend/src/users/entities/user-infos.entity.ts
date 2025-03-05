import { OmitType } from '@nestjs/mapped-types';
import { UserEntity } from './user.entity';

export class UserInfosEntity extends OmitType(UserEntity, [
  'password',
  'verified',
  'createdAt',
  'updatedAt',
] as const) {}
