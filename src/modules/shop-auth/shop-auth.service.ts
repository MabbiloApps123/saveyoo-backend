import { Injectable } from '@nestjs/common';
import { CreateShopAuthDto } from './dto/create-shop-auth.dto';
import { UpdateShopAuthDto } from './dto/update-shop-auth.dto';
import { MailUtils } from 'src/core/utils/mailUtils';
import moment from 'moment';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Store } from '../store/entities/store.entity';
import { Repository } from 'typeorm';
import { BaseService } from 'src/base.service';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class ShopAuthService extends BaseService<Store> {
  protected repository: Repository<Store>;

  constructor(@InjectRepository(Store) storeRepository: Repository<Store>, private readonly jwtService: JwtService) {
    super(storeRepository.manager);
    this.repository = storeRepository;
  }

  async register(createShopAuthDto: CreateShopAuthDto) {
    const { email } = createShopAuthDto;

    // Check if the shop already exists
    const existingShop = await this.findShopByEmail(email);
    if (existingShop) {
      throw new Error('Email is already registered.');
    }

    // Simulate saving the shop data to a database
    const shop = {
      id: Date.now(),
      email,
      email_verified: false,
    };

    // Generate and send OTP to email
    const otp = this.generateOtp();
    await this.createOtp(email, otp);
    MailUtils.sendOtpEmail(email, otp);

    return shop;
  }

  async verifyOtp(email: string, otp: string) {
    const otpData = await this.findOtpByEmail(email);
    if (!otpData || otpData.otp !== otp) {
      throw new Error('Invalid OTP.');
    }

    const now = moment().utc();
    const expires = otpData.expires_at;
    const difference = now.diff(moment.utc(expires), 'seconds');
    if (difference > 0) {
      throw new Error('OTP has expired.');
    }

    // Mark email as verified and generate JWT token
    const shop = await this.updateShopProfile(email, { email_verified: true });
    const token = await this.generateToken({ shop_id: shop.id });

    // Delete OTP after successful verification
    await this.deleteOtp(email);

    return { ...shop, access_token: token };
  }

  private generateOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
  }

  private async generateToken(payload: any) {
    const token = await this.jwtService.signAsync(payload, {
      secret: process.env.JWTKEY,
      expiresIn: '1h',
    });
    return token;
  }

  private async createOtp(email: string, otp: string) {
    const otpRequest = {
      user: email,
      otp: otp,
      created_at: moment().utc().toDate(),
      expires_at: moment().add(10, 'minutes').utc().toDate(),
    };
    const newOtp = this.repository.manager.getRepository('Otp').create(otpRequest);
    await this.repository.manager.getRepository('Otp').save(newOtp);
  }

  private async findOtpByEmail(email: string) {
    return await this.repository.manager.getRepository('Otp').findOne({
      where: { user: email },
    });
  }

  private async deleteOtp(email: string): Promise<void> {
    await this.repository.manager.getRepository('Otp').delete({ user: email });
  }
  private async updateShopProfile(email: string, updateData: any) {
    const shop = await this.findShopByEmail(email);
    if (!shop) {
      throw new Error('Shop not found.');
    }
    await this.repository.update({ email }, updateData);
    return { ...shop, ...updateData };
  }

  private async findShopByEmail(email: string) {
    return await this.repository.findOne({ where: { email } });
  }

  async login(loginDto: LoginDto) {
    const shop = await this.findShopByEmail(loginDto.email_id);
    if (!shop) {
      throw new Error('Shop not found.');
    }

    if (!shop.email_verified) {
      throw new Error('Email is not verified. Please verify your email before logging in.');
    }

    // Generate and send OTP to email
    const otp = this.generateOtp();
    await this.createOtp(loginDto.email_id, otp);
    MailUtils.sendOtpEmail(loginDto.email_id, otp);

    return {
      message: 'OTP has been sent to your email. Please verify to login.',
    };
  }

}
