import { Controller, Get, Post, Body, Patch, Param, Delete, HttpException, HttpStatus } from '@nestjs/common';
import { ShopAuthService } from './shop-auth.service';
import { CreateShopAuthDto } from './dto/create-shop-auth.dto';
import { UpdateShopAuthDto } from './dto/update-shop-auth.dto';
import { LoginDto } from '../auth/dto/login-dto';

@Controller('shop-auth')
export class ShopAuthController {
  constructor(private readonly shopAuthService: ShopAuthService) {}

  @Post('register')
  async register(@Body() createShopAuthDto: CreateShopAuthDto) {
    try {
      const data = await this.shopAuthService.register(createShopAuthDto);
      return { statusCode: 201, message: 'Shop registered successfully!', data };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      const data = await this.shopAuthService.login(loginDto);
      return { statusCode: 200, message: 'Login successful!', data };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }

  @Post('verify-otp')
  async verifyOtp(@Body() verifyOtpDto: { email: string; otp: string }) {
    try {
      const data = await this.shopAuthService.verifyOtp(verifyOtpDto.email, verifyOtpDto.otp);
      return { statusCode: 200, message: 'OTP verified successfully!', data };
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.UNAUTHORIZED);
    }
  }
}
