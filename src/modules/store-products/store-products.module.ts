import { Module } from '@nestjs/common';
import { StoreProductService } from './store-products.service';
import { StoreProductsController } from './store-products.controller';
import { StoreProduct } from './entities/store-product.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Store } from '../store/entities/store.entity';
import { Product } from '../products/entities/product.entity';
import User from '../users/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([StoreProduct,Store,Product,User])],
  controllers: [StoreProductsController],
  providers: [StoreProductService]
})
export class StoreProductsModule {}
