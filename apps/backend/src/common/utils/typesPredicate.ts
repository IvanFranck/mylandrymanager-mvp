import { ServiceEntity } from '@/services/entities/service.entity';
import { Service, ServiceVersion } from '@prisma/client';

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
        'currentVersionId' in item,
    )
  );
}

export function isServiceVersion(data: any): data is ServiceVersion {
  return (
    'id' in data &&
    'createdAt' in data &&
    'price' in data &&
    'label' in data &&
    'serviceId' in data
  );
}

export function isServiceEntity(data: any): data is ServiceEntity {
  return (
    'id' in data &&
    'createdAt' in data &&
    'updatedAt' in data &&
    'userId' in data &&
    'currentVersionId' in data &&
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
        'currentVersionId' in item &&
        Array.isArray(item.versions) &&
        item.versions.every(
          (subitem: any) =>
            'id' in subitem && 'createdAt' in subitem && 'serviceId' in subitem,
        ),
    )
  );
}
