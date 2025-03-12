import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs-extra';

@Injectable()
export class JwtKeysService {
  privateKey: string;
  publicKey: string;

  constructor() {}

  getPublicKey() {
    const publicKeyPath = 'public-key.pem';
    if (!existsSync(publicKeyPath)) {
      throw new InternalServerErrorException('JWT public key file is missing');
    }
    return readFileSync(publicKeyPath, 'utf8');
  }

  getPrivateKey() {
    const privateKeyPath = 'private-key.pem';
    if (!existsSync(privateKeyPath)) {
      throw new InternalServerErrorException('JWT private key file is missing');
    }
    return readFileSync(privateKeyPath, 'utf8');
  }
}
