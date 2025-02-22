import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from 'nestjs-schedule';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StoreModule } from './modules/store/store.module';
import { ProductsModule } from './modules/products/products.module';
import { DBconfig } from './config';
import { StoreProductsModule } from './modules/store-products/store-products.module';
import { FavouriteModule } from './modules/favourite/favourite.module';
// import { DatabaseSeeder } from './seeds/database.seeder';

console.log('env--->',DBconfig)
@Module({
  imports: [
    // DatabaseModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: DBconfig.host,
      port: DBconfig.port,
      username: DBconfig.username,
      password: DBconfig.password,
      database: DBconfig.database,
      entities: [`${__dirname}../../**/**.entity{.ts,.js}`], 
      ssl: false,
      synchronize: true,
      logging:true,
      extra: {
        connectionTimeoutMillis: 2000, // Timeout for connection
      },
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    MulterModule.register({
      dest: './uploads',
    }),
    AuthModule,
    UsersModule,
    StoreModule,
    ProductsModule,
    StoreProductsModule,
    FavouriteModule
  ],
  controllers: [AppController],
  providers: [AppService],

})
export class AppModule implements NestModule {
  constructor() {}
  configure(consumer: MiddlewareConsumer) {}
}
