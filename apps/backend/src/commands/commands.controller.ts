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
} from '@nestjs/common';
import { CommandsService } from './commands.service';
import { CreateCommandDto } from './dto/create-command.dto';
import { UpdateCommandDto } from './dto/update-command.dto';
import { AccessTokenAuthGuard } from 'src/auth/guards/access-token-auth.guard';

@UseGuards(AccessTokenAuthGuard)
@Controller({
  path: 'commands',
  version: '1',
})
export class CommandsController {
  constructor(private readonly commandsService: CommandsService) {}

  @Post()
  async create(@Body() createCommandDto: CreateCommandDto) {
    return await this.commandsService.create(createCommandDto);
  }

  @Get()
  async findAll() {
    return await this.commandsService.findAll();
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
