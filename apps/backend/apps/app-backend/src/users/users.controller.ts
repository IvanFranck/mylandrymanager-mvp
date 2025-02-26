import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user-dto';
import {
  ApiTags,
  ApiBody,
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
} from '@nestjs/swagger';
import { AccessTokenAuthGuard } from '@app-backend/auth/guards/access-token-auth.guard';
import { AccessTokenValidatedRequestInterface } from '@app-backend/common/interfaces/access-token-validated-request.interface';
import { FormatServicesResponseInterceptor } from '@app-backend/common/interceptors/formatServicesResponse.interceptor';

@UseInterceptors(new FormatServicesResponseInterceptor())
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

  @UseGuards(AccessTokenAuthGuard)
  @Get('profile')
  async getUserProfile(@Req() req: AccessTokenValidatedRequestInterface) {
    return await this.usersService.getUserByID(req.user.sub);
  }
}
