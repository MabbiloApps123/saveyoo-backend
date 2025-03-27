import { Controller, Body, Post, Param, HttpException, HttpStatus, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiTags } from '@nestjs/swagger';
import { VerifyOtpDto } from './dto/verify-otp.dto';
import { EC200, EC204, EC500, EM100, EM106, EM127, EM141, EM149 } from 'src/core/constants';
import HandleResponse from 'src/core/utils/handle_response';
import { DeleteDto, LoginDto, ResendEmailDto, SignupDto, userlogoutDto, VerifyEmailDto } from './dto/login-dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() req: LoginDto) {
    try {
      let data = await this.authService.loginWithEmail(req);
      return HandleResponse.buildSuccessObj(EC200, EM106, data);
    } catch (error) {
      return HandleResponse.buildErrObj(error.status, EM100, error);
    }
  }

  @Post('signup')
  async signup(@Body() req: SignupDto) {
    try {
      const data = await this.authService.signup(req);
      return HandleResponse.buildSuccessObj(201, 'Signup successful! Verify your email.', data);
    } catch (error) {
      throw new HttpException(error, HttpStatus.INTERNAL_SERVER_ERROR);
    }
  }

  @Post('resend-otp')
  async resendOtp(@Body() req: ResendEmailDto) {
    try {
      const { code, msg } = await this.authService.resendOtp(req);
      return HandleResponse.buildSuccessObj(code, msg);
    } catch (error) {
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }
  @Post('verify-email')
  @UseGuards(AuthGuard('local'))
  async verifyOtp(@Body() body: VerifyOtpDto) {
    try {
      let { code, msg, data } = await this.authService.verifyOtp(body);
      return HandleResponse.buildSuccessObj(code, msg, data);
    } catch (error) {
      return HandleResponse.buildErrObj(EC500, EM100, error);
    }
  }
  @Post('forgot-password/:email_id')
  async forgotPassword(@Param('email_id') email_id: string) {
    try {
      let data = await this.authService.forgotPassword(email_id);
      return HandleResponse.buildSuccessObj(EC200, EM141, data);
    } catch (error) {
      return HandleResponse.buildErrObj(EC500 || error.status, error?.message || EM100, error);
    }
  }

  @Post('destroy')
  async deleteUser(@Body() deleteDto: DeleteDto) {
    try {
      let data: any = await this.authService.deleteUserData(deleteDto);
      if (data && data?.code === EC204) return data;
      return HandleResponse.buildSuccessObj(EC200, EM127, null);
    } catch (error) {
      return HandleResponse.buildErrObj(EC500 || error.status, error?.message || EM100, error);
    }
  }

  @Post('logout')
  async logout(@Body() logoutDto: userlogoutDto) {
    try {
      let data = await this.authService.logout(logoutDto);
      return HandleResponse.buildSuccessObj(EC200, EM149, null);
    } catch (error) {
      return HandleResponse.buildErrObj(EC500 || error.status, error?.message || EM100, error);
    }
  }
}
