import { OmitType } from '@nestjs/mapped-types';
import { UserEntity } from '@app-backend/users/entities/user.entity';
import { UserAgency } from '@prisma/client';

export class ValidatedUserEntity extends OmitType(UserEntity, [
  'password',
  'verified',
  'createdAt',
  'updatedAt',
] as const) {
  agencyMemberships: UserAgency[];
}
