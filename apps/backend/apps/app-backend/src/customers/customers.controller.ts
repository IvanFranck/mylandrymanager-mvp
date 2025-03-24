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
  Query,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CustomersService } from './customers.service';
import { CreateCustomerDto } from './dto/create-customer.dto';
import { UpdateCustomerDto } from './dto/update-customer.dto';
import { AccessTokenAuthGuard } from '@app-backend/auth/guards/access-token-auth.guard';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import {
  GenericQueryType,
  SearchByNameQueriesType,
} from '@app-backend/common/queries.type';

@ApiTags('customers')
@UseGuards(AccessTokenAuthGuard)
@Controller({
  path: 'customers',
  version: '1',
})
export class CustomersController {
  constructor(private readonly customersService: CustomersService) {}

  @ApiBody({ type: CreateCustomerDto })
  @ApiCreatedResponse({
    description: 'client ajouté !',
  })
  @ApiBadRequestResponse()
  @Post()
  async create(@Body() createCustomerDto: CreateCustomerDto) {
    return await this.customersService.create(createCustomerDto);
  }

  @ApiOkResponse({ description: 'liste des clients' })
  @ApiNotFoundResponse()
  @Get()
  async findAll(@Query() query: GenericQueryType) {
    return await this.customersService.findAll(query);
  }

  @Get('search')
  async searchByName(
    @Query(new ValidationPipe({ transform: true }))
    query: SearchByNameQueriesType,
  ) {
    return await this.customersService.searchByName(query);
  }

  @Get(':id')
  async findOneById(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return await this.customersService.findOneById(id);
  }

  @Put(':id')
  async update(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
    @Body()
    updateCustomerDto: UpdateCustomerDto,
  ) {
    return await this.customersService.update(id, updateCustomerDto);
  }

  @Delete(':id')
  async remove(
    @Param(
      'id',
      new ParseIntPipe({ errorHttpStatusCode: HttpStatus.NOT_ACCEPTABLE }),
    )
    id: number,
  ) {
    return await this.customersService.remove(id);
  }
}
