import { Test, TestingModule } from '@nestjs/testing';
import { FunnyResolver } from './funny.resolver';

describe('FunnyResolver', () => {
  let resolver: FunnyResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FunnyResolver],
    }).compile();

    resolver = module.get<FunnyResolver>(FunnyResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
