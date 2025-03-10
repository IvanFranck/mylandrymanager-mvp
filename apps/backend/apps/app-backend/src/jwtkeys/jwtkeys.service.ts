import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync, readFileSync } from 'fs-extra';

@Injectable()
export class JwtKeysService {
  privateKey: string;
  publicKey: string;

  constructor(private readonly confService: ConfigService) {}

  getPublicKey() {
    const publicKeyPath = this.confService.get('JWT_PUBLIC_KEY_PATH');
    if (!existsSync(publicKeyPath)) {
      throw new InternalServerErrorException('JWT public key file is missing');
    }
    return readFileSync(publicKeyPath, 'utf8');
  }

  getPrivateKey() {
    const privateKeyPath = this.confService.get('JWT_PRIVATE_KEY_PATH');
    if (!existsSync(privateKeyPath)) {
      throw new InternalServerErrorException('JWT private key file is missing');
    }
    return readFileSync(privateKeyPath, 'utf8');
  }
}
