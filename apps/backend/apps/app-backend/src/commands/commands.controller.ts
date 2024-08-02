import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  ParseIntPipe,
  HttpStatus,
  Put,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import { AccessTokenAuthGuard } from '@app-backend/auth/guards/access-token-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiOkResponse,
} from '@nestjs/swagger';
import { AccessTokenValidatedRequestInterface } from '@common-app-backend/interfaces/access-token-validated-request.interface';
import { CustomResponseInterface } from '@common-app-backend/interfaces/response.interface';
import { Command } from '@prisma/client';
import { CommandQueriesType } from '@common-app-backend/queries.type';

@UseGuards(AccessTokenAuthGuard)
@Controller({
  path: 'commands',
  version: '1',
})
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @ApiBody({ type: CreateCommandDto })
  @ApiCreatedResponse({
    description: 'commande ajoutée !',
  })
  @ApiBadRequestResponse()
  @Post()
  /**
   * Endpoint: create a new command.
   *
   * @param {CreateCommandDto} createCommandDto - command data
   * @param {AccessTokenValidatedRequestInterface} req - authenticated request
   * @return {Promise<type>} description of return value
   */
  async create(
    @Body() createCommandDto: CreateCommandDto,
    @Req() req: AccessTokenValidatedRequestInterface,
  ) {
    return await this.commandsService.create(createCommandDto, req);
  }

  @ApiOkResponse({ description: 'liste des commandes' })
  @Get()
  /**
   * Endpoint: Find all commands of a connected landry.
   *
   * @param {AccessTokenValidatedRequestInterface} req -authenticated request
   * @return {Promise<CustomResponseInterface<command[]>>} The list of all commands
   */
  async findAll(
    @Query() query: CommandQueriesType,
    @Req() req: AccessTokenValidatedRequestInterface,
  ): Promise<CustomResponseInterface<Command[]>> {
    return await this.commandsService.findAll(req, query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.commandsService.findOne(+id);
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body() updateCommandDto: UpdateCommandDto,
  ) {
    return await this.commandsService.update(id, updateCommandDto);
  }

  @Delete(':id')
  async remove(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return await this.commandsService.remove(id);
  }
}
