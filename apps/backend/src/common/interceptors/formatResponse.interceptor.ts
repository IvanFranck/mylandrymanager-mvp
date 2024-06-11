import { CustomResponseInterface } from '@/common/interfaces/response.interface';
import { ServiceEntity } from '@/services/entities/service.entity';
import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Service, ServiceVersion } from '@prisma/client';
import { map, Observable } from 'rxjs';
import { isService, isServiceEntityArray } from '../utils/typesPredicate';

type T = Service | ServiceVersion | ServiceEntity;

@Injectable()
export class FormatResponseInterceptor implements NestInterceptor {
  intercept(
    context: ExecutionContext,
    next: CallHandler,
  ): Observable<CustomResponseInterface<T>> {
    return next.handle().pipe(
      map((data: CustomResponseInterface<T>) => {
        if (isService(data.details)) {
          delete data.details.createdAt;
          delete data.details.updatedAt;
          delete data.details.userId;
        } else if (isServiceEntityArray(data.details)) {
          console.log('isServiceEntityArray');
        }
        console.log('data', data);
        return data;
      }),
    );
  }
}
