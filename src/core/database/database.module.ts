import { Module } from '@nestjs/common';
import { databaseProviders, testConnection } from './database.providers';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { PRODUCTION } from '../constants';
import { logger } from '../utils/logger';
import { databaseConfig } from './database.config';
import User from 'src/modules/users/entities/user.entity';
import Otp from 'src/modules/users/entities/otp.entity';
@Module({
  imports: [DataSource],
  providers: [{
    provide: DataSource,
    useFactory: async () => {
      const env = process.env.NODE_ENV || 'development';
      const config = databaseConfig[env];

      if (!config) {
        throw new Error(`Database configuration missing for environment: ${env}`);
      }

      logger.info(`Database configuration loaded for environment: ${env}`);
      logger.info('Database_Config:', JSON.stringify(config));

      const dataSource = new DataSource({
        type: 'postgres',
        host: config.host,
        port: config.port,
        username: config.username,
        password: config.password,
        database: config.database,
        entities: [User,Otp],
        ssl:true,
        synchronize: true, // Set to false in production
        logging: env !== PRODUCTION,
        // timezone: 'Z',
      });

      await testConnection(dataSource);
      logger.info('Database connection initialized successfully.');
      return dataSource;
    },
  },],
  exports: [DataSource],
})
export class DatabaseModule {}
