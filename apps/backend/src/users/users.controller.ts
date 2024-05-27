import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';

@ApiTags('users')
@Controller({
  path: 'users',
  version: '1',
})
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('signup')
  @ApiBody({ type: CreateUserDto })
  @ApiCreatedResponse({ description: 'User successfully created' })
  @ApiInternalServerErrorResponse({ description: 'Internal server error' })
  async signUp(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.createUser(createUserDto);
  }
}
