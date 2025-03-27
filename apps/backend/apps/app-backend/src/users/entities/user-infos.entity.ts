import { OmitType } from '@nestjs/mapped-types';
import { UserEntity } from './user.entity';
import { UserAgency } from '@prisma/client';

export class UserInfosEntity extends OmitType(UserEntity, [
  'password',
  'verified',
  'createdAt',
  'updatedAt',
] as const) {
  agencyMemberships: UserAgency[];
}
