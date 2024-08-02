export class UserEntity {
  id: number;
  username: string;
  password: string;
  phone: string;
  verified?: Date;
  createdAt: Date;
  updatedAt: Date;
}
