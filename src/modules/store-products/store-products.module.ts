import { Module } from '@nestjs/common';
import { StoreProductsService } from './store-products.service';
import { StoreProductsController } from './store-products.controller';

@Module({
  controllers: [StoreProductsController],
  providers: [StoreProductsService]
})
export class StoreProductsModule {}
