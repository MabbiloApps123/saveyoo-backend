import { CacheModule, Module, forwardRef } from '@nestjs/common';

import { UsersService } from './users.service';
import { usersProviders } from './users.providers';
import { commonProvider } from 'src/core/interfaces/common-providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import User from './entities/user.entity';
import { DataSource } from 'typeorm';
import Otp from './entities/otp.entity';

@Module({
  imports: [
    CacheModule.register(),
    TypeOrmModule.forFeature([User,Otp]),
  ],
  providers: [UsersService],
  exports: [UsersService],
  // controllers: [ UsersController],
})
export class UsersModule {}
