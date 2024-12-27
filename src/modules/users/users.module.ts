import {  Module, forwardRef } from '@nestjs/common';

import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
import { commonProvider } from 'src/core/interfaces/common-providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { DataSource } from 'typeorm';
import Otp from './entities/otp.entity';
import { StoreRepository } from '../store/store.repository';
import { Store } from '../store/entities/store.entity';
import { ProductsService } from '../products/products.service';
import { ProductRepository } from '../products/products.repository';

@Module({
  imports: [TypeOrmModule.forFeature([User, Otp, Store])],
  providers: [UsersService, StoreRepository, ProductsService, ProductRepository],
  exports: [UsersService],
  // controllers: [ UsersController ],
})
export class UsersModule {}
