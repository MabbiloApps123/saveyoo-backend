import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from 'nestjs-schedule';
import { MulterModule } from '@nestjs/platform-express';
import { TypeOrmModule } from '@nestjs/typeorm';
// import { databaseConfig } from './core/database/database.config';
import { StoreModule } from './modules/store/store.module';

const env = process.env.NODE_ENV || 'development';
// const config = databaseConfig[env];
// console.log(config);
@Module({
  imports: [
    // DatabaseModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: "dpg-ct9hjpm8ii6s73eckokg-a.singapore-postgres.render.com",
      port: 5432,
      username: "saveyoo_user",
      password: "PquBCsonLPzN0otLLoEFHTTFANJzRHiV",
      database: "saveyoo",
      entities: [`${__dirname}../../**/**.entity{.ts,.js}`],
      ssl: true,
      synchronize: true, // Consider using migrations instead
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  constructor() {}
  configure(consumer: MiddlewareConsumer) {}
}
