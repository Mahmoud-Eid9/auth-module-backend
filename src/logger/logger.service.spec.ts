import { Test, TestingModule } from '@nestjs/testing';
import { LoggerSerivce } from './logger.service';

describe('LoggerService', () => {
  let service: LoggerSerivce;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LoggerSerivce],
    }).compile();

    service = module.get<LoggerSerivce>(LoggerSerivce);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
