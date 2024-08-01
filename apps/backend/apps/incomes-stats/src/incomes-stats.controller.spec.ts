import { Test, TestingModule } from '@nestjs/testing';
import { IncomesStatsController } from './incomes-stats.controller';
import { IncomesStatsService } from './incomes-stats.service';

describe('IncomesStatsController', () => {
  let incomesStatsController: IncomesStatsController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [IncomesStatsController],
      providers: [IncomesStatsService],
    }).compile();

    incomesStatsController = app.get<IncomesStatsController>(IncomesStatsController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(incomesStatsController.getHello()).toBe('Hello World!');
    });
  });
});
