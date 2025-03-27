import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from '../users/users.service';
import { EC200, EC204, EC410, EM103, EM107, EM109 } from 'src/core/constants';
import moment from 'moment';
import User from 'src/modules/users/entities/user.entity';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { logger } from 'src/core/utils/logger';
import { DeleteDto, LoginDto, ResendEmailDto, userlogoutDto } from './dto/login-dto';
import { Errors } from 'src/core/constants/error_enums';
import { MailUtils } from 'src/core/utils/mailUtils';
import { UpdateUserDto } from '../users/dto/user.dto';

@Injectable()
export class AuthService {
  constructor(private readonly userService: UsersService, private readonly jwtService: JwtService) {}

  async verifyOtp(body: VerifyOtpDto) {
    logger.info(`Verify_Otp_Entry: ` + JSON.stringify(body));
    let request = body;
    let otpData = await this.userService.findOtpById(request);
    if (otpData) {
      let now = moment().utc();
      let expires = otpData.expires_at;
      let difference = now.diff(moment.utc(expires), 'seconds');
      if (difference > 0) {
        logger.info(`Verify_OTP_Code_Expired: ` + JSON.stringify(body));
        return { code: EC410, msg: 'Otp Expired' };
      } else {
        body.email_verified = true;
        let user: User = await this.userService.findOneByEmail(otpData.user);
        let token = null;
        // console.log(user);
        if (user) {
          token = await this.generateToken({ user_id: user.id });
        }
        body.user_id = user.id;
        await this.userService.deleteOtp(request.email_id);

        user = await this.userService.updateProfile({
          id: user.id,
          email_id: user.email_id,
          email_verified: true,
        } as UpdateUserDto);
        logger.info(`Verify_OTP_Login_Successfully: ` + JSON.stringify(user));
        return { code: EC200, msg: EM103, data: { ...user, access_token: token } };
      }
    } else {
      logger.info(`Verify_OTP_Invalid_Credentials: ` + JSON.stringify(body));
      return { code: EC204, msg: EM109 };
    }
    // const user = await models.User.findOne();
  }

  public async login(userData: LoginDto): Promise<any> {
    const user: User = await this.userService.findOneByEmail(userData.email_id);
    if (!user) throw new NotFoundException(Errors.USER_NOT_EXISTS);
    // if (!user.password) throw new UnauthorizedException(Errors.INCORRECT_USER_PASSWORD);
    // if (!user.email_verified) throw new UnauthorizedException(EM150);
    // if (!Encryption.comparePassword(userData.password, user.password))
    // throw new UnauthorizedException(Errors.INVALID_USER_DETAILS);
    const token = await this.generateToken(user);
    const refreshToken = await this.generateToken(user);
    // const updatedUser = await this.userService.update(user.id, { device_token: userData?.device_token });
    return { ...user, access_token: token,refreshToken:refreshToken };
  }

  async signup({ email, password }: { email: string; password: string }) {
    let user: User = await this.userService.findOneByEmail(email);
    if (user) {
      throw new Error('Email is already registered.');
    } else {
      user = await this.userService.create({
        email_id: email,
        password: password,
        email_verified: false,
      } as any);
    }
    this.sendOtpToMail(user, email);

    delete user.password;
    return user;
  }

  async loginWithEmail({ email_id }: LoginDto) {
    let user: User = await this.userService.findOneByEmail(email_id);
    if (!user) {
      user = await this.userService.create({
        email_id: email_id,
        password: null,
        email_verified: false,
      } as any);
    }
    this.sendOtpToMail(user, email_id);

    delete user.password;
    return 'Otp sent successfully.Please check the email address';
  }

  private sendOtpToMail(user: User, email: string) {
    const otp = this.generateOtp();
    this.userService.createOtp(user.email_id, otp);
    MailUtils.sendOtpEmail(email, otp);
  }

  async resendOtp({ email }: ResendEmailDto) {
    const otp = this.generateOtp();
    await this.userService.createOtp(email, otp);
    MailUtils.sendOtpEmail(email, otp);

    return { code: EC200, msg: EM107 };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async generateToken(user: any, isRefreshToken = false) {
    const token = await this.jwtService.signAsync(user, {
      secret: process.env.JWTKEY,
      expiresIn: isRefreshToken ? '2h' : '1h',
    });
    return token;
  }

  async refreshToken(token: string) {
    try {
      const decoded = this.jwtService.verify(token, { secret: process.env.JWTKEY });
      const user = await this.userService.findOneById(decoded.user_id);
      if (!user) throw new NotFoundException(Errors.USER_NOT_EXISTS);

      const newToken = await this.generateToken({ user_id: user.id }, false);
      const refreshToken = await this.generateToken({ user_id: user.id }, true); // Generate refresh token
      return { access_token: newToken, refresh_token: refreshToken }; // Include refresh token in response
    } catch (error) {
      throw new NotFoundException(Errors.INVALID_TOKEN);
    }
  }
  async forgotPassword(email_id: string) {
    let user: User = await this.userService.findOneByEmail(email_id);
    if (!user) throw new NotFoundException(Errors.INVALID_USER_DETAILS);
    let otp = this.generateOtp();

    await this.userService.deleteOtp(email_id);
    let result = await this.userService.createOtp(email_id, otp);
    return { user_id: user.id };
  }

  async deleteUserData(req_data: DeleteDto) {
    let res = await this.userService.destroy(req_data.identity);
    return res;
  }

  async logout(req: userlogoutDto) {
    let userLogout = await this.userService.update(req.user_id, { device_token: null });
    return userLogout;
  }
}
