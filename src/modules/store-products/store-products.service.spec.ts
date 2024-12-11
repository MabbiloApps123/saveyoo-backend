import { Test, TestingModule } from '@nestjs/testing';
import { StoreProductsService } from './store-products.service';

describe('StoreProductsService', () => {
  let service: StoreProductsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [StoreProductsService],
    }).compile();

    service = module.get<StoreProductsService>(StoreProductsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
