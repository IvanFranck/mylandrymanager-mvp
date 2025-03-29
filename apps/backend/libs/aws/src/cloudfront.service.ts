import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as AWS from 'aws-sdk';

@Injectable()
export class CloudFrontService {
  private cloudFront: AWS.CloudFront.Signer;
  private distributionDomain: string;
  private readonly logger = new Logger(CloudFrontService.name);

  constructor(private configService: ConfigService) {
    const privateKey = this.configService.get<string>('CLOUDFRONT_PRIVATE_KEY');
    const keyPairId = this.configService.get<string>('CLOUDFRONT_KEY_PAIR_ID');

    this.cloudFront = new AWS.CloudFront.Signer(keyPairId, privateKey);
    this.distributionDomain =
      this.configService.get<string>('CLOUDFRONT_DOMAIN');
  }

  /**
   * Génère une URL signée CloudFront pour accéder à une facture
   */
  async generateSignedUrl(
    s3Key: string,
    expiresIn: number = 3600,
  ): Promise<string> {
    try {
      // Construire l'URL CloudFront avec le chemin correct
      const url = `https://${this.distributionDomain}/${s3Key}`;

      // Calculer la date d'expiration en secondes depuis l'epoch
      const expiry = Math.floor(Date.now() / 1000) + expiresIn;

      // Générer l'URL signée
      return this.cloudFront.getSignedUrl({
        url,
        expires: expiry,
      });
    } catch (error) {
      this.logger.error(
        `Erreur lors de la génération d'URL CloudFront pour ${s3Key}:`,
        error,
      );
      throw error;
    }
  }

  /**
   * Invalide un ou plusieurs fichiers dans le cache CloudFront
   */
  async invalidateCache(s3Keys: string[]): Promise<void> {
    try {
      const cloudFrontClient = new AWS.CloudFront({
        region: this.configService.get<string>('AWS_REGION'),
        credentials: {
          accessKeyId: this.configService.get<string>('AWS_ACCESS_KEY_ID'),
          secretAccessKey: this.configService.get<string>(
            'AWS_SECRET_ACCESS_KEY',
          ),
        },
      });

      // Préparer les chemins pour invalidation
      const paths = s3Keys.map((key) => `/${key}`);

      await cloudFrontClient
        .createInvalidation({
          DistributionId: this.configService.get<string>(
            'CLOUDFRONT_DISTRIBUTION_ID',
          ),
          InvalidationBatch: {
            CallerReference: `invoice-invalidation-${Date.now()}`,
            Paths: {
              Quantity: paths.length,
              Items: paths,
            },
          },
        })
        .promise();

      this.logger.log(
        `Cache CloudFront invalidé pour ${paths.length} fichiers`,
      );
    } catch (error) {
      this.logger.error(
        "Erreur lors de l'invalidation du cache CloudFront:",
        error,
      );
      throw error;
    }
  }
}
