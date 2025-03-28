import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { IncomesService } from './incomes.service';
import { AccessTokenAuthGuard } from '@app-backend/auth/guards/access-token-auth.guard';
import { IncomesQueriesType } from '@app-backend/common/queries.type';

@UseGuards(AccessTokenAuthGuard)
@Controller({
  path: 'incomes',
  version: '1',
})
export class IncomesController {
  constructor(private incomesService: IncomesService) {}

  @Get('/')
  async getIncomes(@Query() query: IncomesQueriesType) {
    return await this.incomesService.getIncomes(query);
  }
}
