import { Test, TestingModule } from '@nestjs/testing';
import { FunnyService } from './funny.service';

describe('FunnyService', () => {
  let service: FunnyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FunnyService],
    }).compile();

    service = module.get<FunnyService>(FunnyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
