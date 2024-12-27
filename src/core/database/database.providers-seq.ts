// import { Sequelize } from 'sequelize-typescript';
// import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION, STAGING, LOCAL } from '../constants';
// import { databaseConfig } from './database.config';
// import path, { join } from 'path';
// import * as glob from 'glob';
// import { logger } from '../utils/logger';
// export let FRONTEND_BASE_URL: string;
// export const databaseProviders = [
//   {
//     provide: SEQUELIZE,
//     value: Sequelize,
//     useFactory: async () => {
//       const env = process.env.NODE_ENV || 'development';
//       const config = databaseConfig[env];
// console.log(config)
//       if (!config) {
//         throw new Error(`Database configuration missing for environment: ${env}`);
//       }

//       logger.info(`Database configuration loaded for environment: ${env}`);
//       logger.info('Database_Config:', JSON.stringify(config));

//       let sequelize = new Sequelize({
//         dialectOptions: {
//           useUTC: true,
//           timezone: 'UTC',
//         },
//         ...config,
//         sync: {
//           alter: true,
//           // force: true
//         },
//         logging: process.env.NODE_ENV != PRODUCTION,
//       });

//       sequelize.addModels(getModels());

//       await testConnection(sequelize);
//       await synchronizeModels(sequelize);
//       return sequelize;
//     },
//   },
// ];
// function getModels() {
//   const modelFiles = glob.sync(path.resolve(__dirname, '../modules/**/*.entity.{ts,js}'));
//   const models = modelFiles.map((file) => require(file).default);
//   return models;
// }

// /**
//  * Test the database connection.
//  */
// async function testConnection(sequelize: Sequelize) {
//   try {
//     await sequelize.authenticate();
//     console.log('Database connection established successfully.');
//     logger.info('Database connection established successfully.');
//   } catch (error) {
//     console.error('Unable to connect to the database:', error);
//     logger.error('Database connection error:', JSON.stringify(error));
//     throw error;
//   }
// }

// /**
//  * Synchronize models with the database.
//  */
// async function synchronizeModels(sequelize: Sequelize) {
//   try {
//     await sequelize.sync();
//     console.log('All models synchronized successfully.');
//     logger.info('All models synchronized successfully.');
//   } catch (error) {
//     console.error('Error synchronizing models:', error);
//     logger.error('Model synchronization error:', JSON.stringify(error));
//     throw error;
//   }
// }
