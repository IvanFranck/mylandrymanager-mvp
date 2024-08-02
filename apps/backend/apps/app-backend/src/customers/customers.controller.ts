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
  Req,
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
import { AccessTokenValidatedRequestInterface } from '@common-app-backend/interfaces/access-token-validated-request.interface';

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
  async create(
    @Body() createCustomerDto: CreateCustomerDto,
    @Req() req: AccessTokenValidatedRequestInterface,
  ) {
    return await this.customersService.create(createCustomerDto, req);
  }

  @ApiOkResponse({ description: 'liste des clients' })
  @ApiNotFoundResponse()
  @Get()
  async findAll(@Req() req: AccessTokenValidatedRequestInterface) {
    return await this.customersService.findAll(req);
  }

  @Get('search')
  async findOne(@Query('name') name: string) {
    return await this.customersService.findOne(name);
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
