export class UserEntity {
  id: number;
  username: string;
  password: string;
  phone: number;
  verified?: Date;
  createdAt: Date;
  updatedAt: Date;
}
