import { ServiceEntity } from '@/services/entities/service.entity';
import { Service } from '@prisma/client';

// service
export function isService(data: any): data is Service {
  return (
    'id' in data &&
    'createdAt' in data &&
    'updatedAt' in data &&
    'userId' in data
  );
}

export function isServiceArray(data: any): data is Service[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item: any) =>
        'id' in item &&
        'createdAt' in item &&
        'updatedAt' in item &&
        'userId' in item &&
        'currentVersion' in item,
    )
  );
}

export function isServiceEntity(data: any): data is ServiceEntity {
  return (
    'id' in data &&
    'createdAt' in data &&
    'updatedAt' in data &&
    'userId' in data &&
    'currentVersion' in data &&
    Array.isArray(data.versions) &&
    data.versions.every(
      (item: any) => 'id' in item && 'createdAt' in item && 'serviceId' in item,
    )
  );
}

export function isServiceEntityArray(data: any): data is ServiceEntity[] {
  return (
    Array.isArray(data) &&
    data.every(
      (item: any) =>
        'id' in item &&
        'createdAt' in item &&
        'updatedAt' in item &&
        'userId' in item &&
        'currentVersion' in item &&
        Array.isArray(item.versions) &&
        item.versions.every(
          (subitem: any) =>
            'id' in subitem && 'createdAt' in subitem && 'serviceId' in subitem,
        ),
    )
  );
}
