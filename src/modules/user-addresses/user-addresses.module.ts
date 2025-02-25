import { Module } from '@nestjs/common';
import { UserAddressesService } from './user-addresses.service';
import { UserAddressesController } from './user-addresses.controller';
import { UserAddress } from './entities/user-address.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserAddress])],
  controllers: [UserAddressesController],
  providers: [UserAddressesService],
})
export class UserAddressesModule {}
