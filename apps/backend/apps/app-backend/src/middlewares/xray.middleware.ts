import { Injectable, NestMiddleware } from '@nestjs/common';
import * as AWSXRay from 'aws-xray-sdk';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class XRayMiddleware implements NestMiddleware {
  constructor() {
    AWSXRay.setDaemonAddress('localhost:2000'); // Configurez l'adresse du daemon X-Ray
    AWSXRay.middleware.setSamplingRules({
      version: 2,
      default: {
        fixed_target: 1,
        rate: 1.0,
      },
      rules: [
        {
          description: 'Default',
          host: '*',
          http_method: '*',
          url_path: '*',
          fixed_target: 1,
          rate: 1.0,
        },
      ],
    });
  }

  use(req: Request, res: Response, next: NextFunction) {
    AWSXRay.express.openSegment('MyLaundryAPI')(req, res, next);
  }
}
