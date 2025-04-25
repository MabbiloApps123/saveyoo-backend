import { Test, TestingModule } from '@nestjs/testing';
import { ShopAuthController } from './shop-auth.controller';
import { ShopAuthService } from './shop-auth.service';

describe('ShopAuthController', () => {
  let controller: ShopAuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ShopAuthController],
      providers: [ShopAuthService],
    }).compile();

    controller = module.get<ShopAuthController>(ShopAuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
