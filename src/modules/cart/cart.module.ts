import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import { Cart } from './entities/cart.entity';
import { StoreProductService } from '../store-products/store-products.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { StoreProduct } from '../store-products/entities/store-product.entity';
import { Store } from '../store/entities/store.entity';
import { Product } from '../products/entities/product.entity';
import User from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([StoreProduct,Store,Product,User,Cart])],
  controllers: [CartController],
  providers: [CartService,StoreProductService,SchedulerRegistry],
})
export class CartModule {}