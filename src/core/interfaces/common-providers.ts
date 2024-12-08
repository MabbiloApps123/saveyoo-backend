import {
  USER_REPOSITORY,
  OTP_REPOSTIORY,
  SEQUELIZE,
} from '../constants';
import Otp from 'src/modules/users/entities/otp.entity';
import User from '../../modules/users/entities/user.entity';





export const commonProvider = {
  // sequelize_repo: {
  //   provide: SEQUELIZE,
  //   useValue: Sequelize,
  // },
  user_repo: {
    provide: USER_REPOSITORY,
    useValue: User,
  },
  otp_repo: {
    provide: OTP_REPOSTIORY,
    useValue: Otp,
  },


};
