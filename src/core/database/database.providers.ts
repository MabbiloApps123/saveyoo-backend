// import { DataSource } from 'typeorm';
// import { DEVELOPMENT, TEST, PRODUCTION, STAGING, LOCAL } from '../constants';
// import { databaseConfig } from './database.config';
// import path from 'path';
// import * as glob from 'glob';
// import { logger } from '../utils/logger';
// import User from 'src/modules/users/entities/user.entity';
// import Otp from 'src/modules/users/entities/otp.entity';

// export let FRONTEND_BASE_URL: string;

// export const databaseProviders = [
//   {
//     provide: DataSource,
//     useFactory: async () => {
//       const env = process.env.NODE_ENV || 'development';
//       const config = databaseConfig[env];

//       if (!config) {
//         throw new Error(`Database configuration missing for environment: ${env}`);
//       }

//       logger.info(`Database configuration loaded for environment: ${env}`);
//       logger.info('Database_Config:', JSON.stringify(config));

//       const dataSource = new DataSource({
//         type: 'postgres',
//         host: config.host,
//         port: config.port,
//         username: config.username,
//         password: config.password,
//         database: config.database,
//         entities: [`${__dirname}/../**/**.entity{.ts,.js}`],
//         ssl:true,
//         synchronize: true, // Set to false in production
//         logging: env !== PRODUCTION,
//         // timezone: 'Z',
//       });

//       await testConnection(dataSource);
//       logger.info('Database connection initialized successfully.');
//       return dataSource;
//     },
//   },
// ];

// /**
//  * Dynamically load all entity files.
//  */
// export function getEntities() {
//   const entityFiles = glob.sync(path.resolve(__dirname, '../modules/**/*.entity.{ts,js}'));
//   const entities = entityFiles.map((file) => require(file).default);
//   return entities;
// }

// /**
//  * Test the database connection.e
//  */
// export async function testConnection(dataSource: DataSource) {
//   try {
//     await dataSource.initialize();
//     logger.info('Database connection established successfully.');
//   } catch (error) {
//     logger.error('Database connection error:', JSON.stringify(error));
//     throw error;
//   }
// }
