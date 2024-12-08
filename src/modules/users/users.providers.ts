import { commonProvider } from 'src/core/interfaces/common-providers';
import {
  SEQUELIZE
} from '../../core/constants';
import { Sequelize } from 'sequelize-typescript';

export const usersProviders = [

  {
    provide: SEQUELIZE,
    useValue: Sequelize,
  },
  commonProvider.user_repo,
  commonProvider.otp_repo,
];
