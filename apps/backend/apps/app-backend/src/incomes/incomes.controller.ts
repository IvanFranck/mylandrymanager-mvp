import { Controller, Get, Query, Req, UseGuards } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { IncomesQueriesDTO } from './dto/incomes-params.dto';
import { AccessTokenValidatedRequestInterface } from '@app-backend/common/interfaces/access-token-validated-request.interface';
import { AccessTokenAuthGuard } from '@app-backend/auth/guards/access-token-auth.guard';

@UseGuards(AccessTokenAuthGuard)
@Controller({
  path: 'incomes',
  version: '1',
})
export class IncomesController {
  constructor(private incomesService: IncomesService) {}

  @Get('/')
  async getIncomes(
    @Query() query: IncomesQueriesDTO,
    @Req() req: AccessTokenValidatedRequestInterface,
  ) {
    return await this.incomesService.getIncomes(query, req);
  }
}
