import { PrismaService } from '@app/prisma';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AgenciesService {
  constructor(private readonly prisma: PrismaService) {}

  async create() {}
}
