import { JwtKeysService } from '@/jwtkeys/jwtkeys.service';
import { Module } from '@nestjs/common';

@Module({
  providers: [JwtKeysService],
  exports: [JwtKeysService],
})
export class JwtKeysModule {}
