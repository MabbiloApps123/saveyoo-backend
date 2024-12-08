// import { Injectable, Inject, ConflictException } from '@nestjs/common';

// import { OTP_REPOSTIORY, USER_REPOSITORY } from '../../core/constants';

// import { ModelCtor } from 'sequelize-typescript';
// import { BaseService } from 'src/base.service';
// import { Op } from 'sequelize';
// import { VerifyOtpDto } from '../auth/dto/verify-otp.dto';
// import { UpdateUserDto } from './dto/user.dto';
// import { Errors } from 'src/core/constants/error_enums';
// import { logger } from 'src/core/utils/logger';
// import Otp from 'src/modules/users/entities/Otp';
// import Helpers from 'src/core/utils/helpers';
// import User from 'src/modules/users/entities/User';
// import moment from 'moment';
// import { Repository } from 'typeorm';

// @Injectable()
// export class UsersService extends BaseService<User> {
//   protected repository: Repository<User>;
//   // protected model: ModelCtor<User>;
//   area_filter: Array<string>;
//   constructor(
//     @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
//     @Inject(OTP_REPOSTIORY) private readonly otp_repo: typeof Otp,
//   ) {
//     super();
//     this.repository = this.userRepository;
//   }
//   init() {}

//   //Insert new user record
//   async create(user: User): Promise<User> {
//     return await super.create(user);
//   }

//   //TODO need to pass id directly instead of passing object
//   async findOneById(id: any): Promise<any> {
//     let user = await super.findOne(id);
//     return user;
//   }
//   //Insert otp

//   //Find user using email
//   async findOneByEmail(email_id: string): Promise<User> {
//     return await super.findOne(null, {
//       where: { email_id: email_id },
//     });
//   }

//   //Update already registered user
//   public async updateProfile(body: UpdateUserDto | VerifyOtpDto) {
//     logger.info(`User_UpdateProfile_Entry: ` + JSON.stringify(body));
//     let user_id: string = 'id' in body ? body.id : body.user_id;
//     let user: User;
//     if ('email_id' in body) {
//       user = await Helpers.findOne(this.userRepository, {
//         where: { email_id: body.email_id, id: { [Op.ne]: user_id } },
//       });
//       if (user) throw new ConflictException(Errors.EMAIL_ID_ALREADY_EXISTS);
//     }

//     // create the user
//     let newUser: any = await Helpers.update(this.userRepository, { where: { id: user_id } }, { ...body });
//     logger.info(`User_UpdateProfile_Exit: ` + JSON.stringify(newUser));
//     return newUser;
//   }

//   async createOtp(email: string, otp: string): Promise<Otp> {
//     let otpRequest = {
//       user: email,
//       otp: otp,
//       created_at: moment().utc().format(),
//       expires_at: moment().add(5, 'minutes').utc().format(),
//     };
//     return await Otp.create<Otp>(otpRequest);
//   }
//   //Remove otp`
//   async deleteOtp(user: string) {
//     return Otp.destroy<Otp>({
//       where: {
//         user: user,
//       },
//     });
//   }
//   //Get otp using id
//   async findOtpById(request: VerifyOtpDto): Promise<Otp> {
//     return await Helpers.findOne(this.otp_repo, {
//       where: { user: request.email, otp: request.otp },
//     });
//   }
// }


import { Injectable, Inject, ConflictException } from '@nestjs/common';
import { Not, Repository } from 'typeorm';
import { BaseService } from 'src/base.service';
import { VerifyOtpDto } from '../auth/dto/verify-otp.dto';
import { UpdateUserDto } from './dto/user.dto';
import { Errors } from 'src/core/constants/error_enums';
import { logger } from 'src/core/utils/logger';
import  Otp  from 'src/modules/users/entities/otp.entity';
import  User  from 'src/modules/users/entities/user.entity';
import moment from 'moment';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsersService extends BaseService<User> {
  protected repository: Repository<User>;
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Otp) private readonly otpRepository: Repository<Otp>,
  ) {
    super(userRepository.manager); // Pass EntityManager to BaseService
    this.repository = userRepository; // Set the repository for BaseService
  }

  /**
   * Create a new user record.
   */
  async create(user: Partial<User>): Promise<User> {
    return await super.create(user);
  }

  /**
   * Find a user by ID.
   */
  async findOneById(id: number): Promise<User | null> {
    return await super.findOne(id);
  }

  /**
   * Find a user by email.
   */
  async findOneByEmail(email: string): Promise<User | null> {
    return await this.repository.findOne({ where: { email_id: email } });
  }

  /**
   * Update an existing user's profile.
   */
  async updateProfile(body: UpdateUserDto | VerifyOtpDto): Promise<User> {
    logger.info(`User_UpdateProfile_Entry: ${JSON.stringify(body)}`);

    const userId = 'id' in body ? body.id : body.user_id;

    if ('email_id' in body) {
      const existingUser = await this.repository.findOne({
        where: { email_id: body.email_id, id: Not(userId) },
      });
      if (existingUser) {
        throw new ConflictException(Errors.EMAIL_ID_ALREADY_EXISTS);
      }
    }

    await this.repository.update(userId, body);

    const updatedUser = await this.findOneById(userId);
    logger.info(`User_UpdateProfile_Exit: ${JSON.stringify(updatedUser)}`);
    return updatedUser!;
  }

  /**
   * Create an OTP for a user.
   */
  async createOtp(email: string, otp: string): Promise<Otp> {
    const otpRequest = {
      user: email,
      otp: otp,
      created_at: moment().utc().toDate(),
      expires_at: moment().add(5, 'minutes').utc().toDate(),
    };
    const newOtp = this.otpRepository.create(otpRequest);
    return await this.otpRepository.save(newOtp);
  }

  /**
   * Delete OTPs for a user.
   */
  async deleteOtp(user: string): Promise<void> {
    await this.otpRepository.delete({ user });
  }

  /**
   * Find an OTP by email and OTP code.
   */
  async findOtpById(request: VerifyOtpDto): Promise<Otp | null> {
    return await this.otpRepository.findOne({
      where: { user: request.email, otp: request.otp },
    });
  }
}
