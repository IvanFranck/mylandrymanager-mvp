export class ServiceEntity {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  agencyId: number;
  currentVersionId: number;
  currentVersion: {
    id: number;
    createdAt: Date;
    label: string;
    price: number;
    description: string;
    serviceId: number;
  };
}
