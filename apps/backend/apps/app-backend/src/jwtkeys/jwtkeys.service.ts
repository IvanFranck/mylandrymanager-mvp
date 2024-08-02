import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { existsSync, readFileSync } from 'fs-extra';

@Injectable()
export class JwtKeysService {
  privateKey: string;
  publicKey: string;

  constructor() {
    const publicKeyPath = 'public-key.pem';
    const privateKeyPath = 'private-key.pem';
    if (!existsSync(publicKeyPath) || !existsSync(privateKeyPath)) {
      throw new InternalServerErrorException('JWT key files are missing');
    }

    this.publicKey = readFileSync(publicKeyPath, 'utf8');
    this.privateKey = readFileSync(privateKeyPath, 'utf8');

    if (!this.publicKey || !this.privateKey) {
      throw new InternalServerErrorException('JWT key files are empty');
    }
  }
}
