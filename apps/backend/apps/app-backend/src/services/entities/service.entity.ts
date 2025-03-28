import { Service } from '@prisma/client';
export type ServiceEntity = Service & {
  currentVersion: {
    id: number;
    createdAt: Date;
    label: string;
    price: number;
    description: string;
    serviceId: number;
  };
};
