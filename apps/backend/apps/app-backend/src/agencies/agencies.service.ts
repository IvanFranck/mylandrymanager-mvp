import { PrismaService } from '@app/prisma';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateAgencyDto } from './dto/create-agency.dto';
import { UserAgentEntity } from './entities/use-agent.entity';

@Injectable()
export class AgenciesService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createAgencyDto: CreateAgencyDto): Promise<UserAgentEntity> {
    const { ownerId, ...agencyData } = createAgencyDto;
    try {
      const agency = await this.prisma.$transaction(async (tx) => {
        const newAgency = await tx.agency.create({
          data: {
            ...agencyData,
            owner: {
              connect: {
                id: ownerId,
              },
            },
          },
        });

        if (newAgency) {
          return await tx.userAgency.create({
            data: {
              role: 'OWNER',
              user: {
                connect: {
                  id: ownerId,
                },
              },
              agency: {
                connect: {
                  id: newAgency.id,
                },
              },
            },
            select: {
              userId: true,
              agencyId: true,
              createdAt: true,
              user: true,
              agency: true,
            },
          });
        }
        throw new BadRequestException("erreur lors de la création de l'agence");
      });

      return agency;
    } catch (error) {}
  }
}
