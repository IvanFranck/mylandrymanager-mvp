import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Put,
  ParseIntPipe,
  HttpStatus,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ServicesService } from './services.service';
import { CreateServiceDto } from './dto/create-service.dto';
import { UpdateServiceDto } from './dto/update-service.dto';
import { AccessTokenAuthGuard } from 'src/auth/guards/access-token-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { AccessTokenValidatedRequestInterface } from '@/common/interfaces/access-token-validated-request.interface';
import { Service } from '@prisma/client';
import { CustomResponseInterface } from '@/common/interfaces/response.interface';

@ApiTags('services')
@UseGuards(AccessTokenAuthGuard)
@Controller({
  path: 'services',
  version: '1',
})
export class ServicesController {
  constructor(private readonly servicesService: ServicesService) {}

  @ApiBody({ type: CreateServiceDto })
  @ApiCreatedResponse({ description: 'service créé!' })
  @ApiBadRequestResponse({ description: 'un service avec ce nom existe déja' }) // TODO gérer cette erreur: le cas où s=le service est créé par des comptes utilisateurs différents
  @Post()
  async create(
    @Body() createServiceDto: CreateServiceDto,
    @Req() req: AccessTokenValidatedRequestInterface,
  ) {
    return await this.servicesService.create(createServiceDto, req);
  }

  /**
   * Find all services.
   *
   * @return {Promise<CustomResponseInterface<Service[]>>} The list of all services
   */
  @ApiOkResponse({ description: 'liste des services' })
  @Get()
  async findAll(
    @Req() req: AccessTokenValidatedRequestInterface,
  ): Promise<CustomResponseInterface<Service[]>> {
    return await this.servicesService.findAll(req);
  }

  @Get('search')
  async findOneByname(
    @Query('name') name: string,
    @Req() req: AccessTokenValidatedRequestInterface,
  ) {
    return await this.servicesService.findOneByName(name, req);
  }

  @ApiParam({ name: 'id', type: Number })
  @Get(':id')
  async findOneById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Req() req: AccessTokenValidatedRequestInterface,
  ) {
    return await this.servicesService.findOneById(id, req);
  }

  @ApiBody({ type: UpdateServiceDto })
  @ApiParam({ name: 'id', type: Number })
  @ApiCreatedResponse({ description: 'service modifié !' })
  @ApiBadRequestResponse({ description: 'impossible de trouver ce service' })
  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() updateServiceDto: UpdateServiceDto,
  ) {
    return await this.servicesService.update(id, updateServiceDto);
  }

  @ApiParam({ name: 'id', type: Number })
  @ApiCreatedResponse({ description: 'service supprimé !' })
  @ApiBadRequestResponse({ description: 'impossible de trouver ce service' })
  @Delete(':id')
  async remove(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return await this.servicesService.remove(id);
  }
}
