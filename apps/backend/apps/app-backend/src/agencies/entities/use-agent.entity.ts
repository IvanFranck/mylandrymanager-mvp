import { Agency, User } from '@prisma/client';

export class UserAgentEntity {
  userId: number;
  agencyId: number;
  createdAt: Date;
  agency: Agency;
  user: User;
}
