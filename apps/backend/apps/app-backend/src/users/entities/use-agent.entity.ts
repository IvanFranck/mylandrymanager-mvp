export class UserAgentEntity {
  userId: number;
  agencyId: number;
  createdAt: Date;
  agency: {
    name: string;
    address: string;
    phone: string;
  };
  user: {
    username: string;
    phone: string;
  };
}
