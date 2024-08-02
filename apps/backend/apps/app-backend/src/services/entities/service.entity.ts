export class ServiceEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  userId: number;
  currentVersionId: number;
  versions: {
    id: number;
    createdAt: Date;
    label: string;
    price: number;
    description: string;
    serviceId: number;
  }[];
}
