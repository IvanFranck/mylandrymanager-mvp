import { CustomResponseInterface } from '@common-app-backend/interfaces/response.interface';
import { ServiceEntity } from '@app-backend/services/entities/service.entity';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Service, ServiceVersion } from '@prisma/client';
import { map, Observable } from 'rxjs';
import {
  isService,
  isServiceEntity,
  isServiceEntityArray,
  isServiceVersion,
} from '../utils/typesPredicate';

type T = Service | ServiceVersion | ServiceEntity;

@Injectable()
export class FormatServicesResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CustomResponseInterface<T>> {
    return next.handle().pipe(
      map<CustomResponseInterface<T>, CustomResponseInterface<any>>(
        (data: CustomResponseInterface<T>) => {
          if (isServiceEntity(data.details)) {
            delete data.details.userId;
            const { versions, ...otherInfos } = data.details;
            const version = versions[0];
            if (isServiceVersion(version)) {
              delete version.createdAt;
              delete version.id;
              delete version.serviceId;
            }
            delete data.details.versions;
            data.details = {
              ...version,
              ...otherInfos,
            };
          } else if (isService(data.details)) {
            delete data.details.createdAt;
            delete data.details.updatedAt;
            delete data.details.userId;
          } else if (isServiceVersion(data.details)) {
            delete data.details.createdAt;
            delete data.details.serviceId;
          } else if (isServiceEntityArray(data.details)) {
            const details: any[] = data.details;
            const result = details.map((item: any) => {
              delete item.currentVersion;
              delete item.userId;
              const { versions, ...otherInfos } = item;
              const version = versions[0];
              if (isServiceVersion(version)) {
                delete version.createdAt;
                delete version.id;
                delete version.serviceId;
              }
              delete item.versions;
              return {
                ...version,
                ...otherInfos,
              };
            });
            return {
              message: data.message,
              details: result,
            };
          }
          return data;
        },
      ),
    );
  }
}
