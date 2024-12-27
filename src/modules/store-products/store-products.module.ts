import { Module } from '@nestjs/common';
import { StoreProductsService } from './store-products.service';
import { StoreProductsController } from './store-products.controller';
import { StoreProduct } from './entities/store-product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports:[TypeOrmModule.forFeature([StoreProduct])],
  controllers: [StoreProductsController],
  providers: [StoreProductsService]
})
export class StoreProductsModule {}
