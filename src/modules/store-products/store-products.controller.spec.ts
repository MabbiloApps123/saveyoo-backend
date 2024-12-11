import { Test, TestingModule } from '@nestjs/testing';
import { StoreProductsController } from './store-products.controller';
import { StoreProductsService } from './store-products.service';

describe('StoreProductsController', () => {
  let controller: StoreProductsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [StoreProductsController],
      providers: [StoreProductsService],
    }).compile();

    controller = module.get<StoreProductsController>(StoreProductsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
