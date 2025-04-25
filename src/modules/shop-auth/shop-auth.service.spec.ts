import { Test, TestingModule } from '@nestjs/testing';
import { ShopAuthService } from './shop-auth.service';
import { JwtService } from '@nestjs/jwt';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Store } from '../store/entities/store.entity';
import { Repository } from 'typeorm';
import { MailUtils } from 'src/core/utils/mailUtils';
import { CreateShopAuthDto } from './dto/create-shop-auth.dto';
import { LoginDto } from './dto/login.dto';
import request from 'supertest';
import { INestApplication } from '@nestjs/common';
import { AppModule } from '../../app.module';

// jest.mock('src/core/utils/mailUtils');

describe('ShopAuthService', () => {
  let service: ShopAuthService;
  let repository: Repository<Store>;
  let jwtService: JwtService;

  const createShopAuthDto: CreateShopAuthDto = {
    email: 'dummy@example.com',
    name: 'Dummy Shop',
    about: 'This is a dummy shop',
    web_url: 'https://dummyshop.com',
    icon_url: 'https://dummyshop.com/icon.png',
    image_url: 'https://dummyshop.com/image.png',
    mobile_no: '1234567890',
    alternate_mobile_no: '0987654321',
    password: 'dummyPassword123',
    street: '123 Dummy Street',
    city: 'Dummy City',
    state: 'Dummy State',
    postal_code: '123456',
    country: 'Dummy Country',
    category: 'Dummy Category',
    open_time: '09:00',
    close_time: '18:00',
    owner_id: 1,
    business_start_date: new Date('2023-01-01'),
    gst_no: 'DUMMYGST123',
    acc_no: '123456789012',
    ifsc_code: 'DUMMYIFSC',
    bank_branch: 'Dummy Branch',
    latitude: 12.345678,
    longitude: 98.765432,
    VAT: '10%',
  };

  // beforeEach(async () => {
  //   const module: TestingModule = await Test.createTestingModule({
  //     providers: [
  //       ShopAuthService,
  //       {
  //         provide: getRepositoryToken(Store),
  //         useClass: Repository,
  //       },
  //       {
  //         provide: JwtService,
  //         useValue: {
  //           signAsync: jest.fn(),
  //         },
  //       },
  //     ],
  //   }).compile();

  //   service = module.get<ShopAuthService>(ShopAuthService);
  //   repository = module.get<Repository<Store>>(getRepositoryToken(Store));
  //   jwtService = module.get<JwtService>(JwtService);
  // });

  // it('should be defined', () => {
  //   expect(service).toBeDefined();
  // });

  // describe('register', () => {
  //   it('should throw an error if email is already registered', async () => {
  //     jest.spyOn(service as any, 'findShopByEmail').mockResolvedValueOnce({ email: 'test@example.com' } as Store);

  //     await expect(service.register(createShopAuthDto)).rejects.toThrow('Email is already registered.');
  //   });

  //   it('should create a shop and send OTP', async () => {
  //     // jest.spyOn(service, 'findShopByEmail').mockResolvedValueOnce(null);
  //     // jest.spyOn(service, 'createOtp').mockResolvedValueOnce(undefined);
  //     jest.spyOn(MailUtils, 'sendOtpEmail').mockImplementation();

  //     const result = await service.register(createShopAuthDto);

  //     expect(result).toHaveProperty('email', 'dummy@example.com');
  //     expect(MailUtils.sendOtpEmail).toHaveBeenCalledWith('dummy@example.com', expect.any(String));
  //   });
  // });

  // describe('verifyOtp', () => {
  //   it('should throw an error if OTP is invalid', async () => {
  //     // jest.spyOn(service, 'findOtpByEmail').mockResolvedValueOnce("hkjh");

  //     await expect(service.verifyOtp('test@example.com', '123456')).rejects.toThrow('Invalid OTP.');
  //   });

  //   it('should throw an error if OTP has expired', async () => {
  //     jest.spyOn(service, 'findOtpByEmail').mockResolvedValueOnce({
  //       otp: '123456',
  //       expires_at: new Date(Date.now() - 1000),
  //     });

  //     await expect(service.verifyOtp('test@example.com', '123456')).rejects.toThrow('OTP has expired.');
  //   });

  //   it('should verify OTP and return access token', async () => {
  //     jest.spyOn(service, 'findOtpByEmail').mockResolvedValueOnce({
  //       otp: '123456',
  //       expires_at: new Date(Date.now() + 1000),
  //     });
  //     jest.spyOn(service, 'updateShopProfile').mockResolvedValueOnce({ id: 1, email_verified: true } as Store);
  //     jest.spyOn(service, 'generateToken').mockResolvedValueOnce('mockToken');
  //     jest.spyOn(service, 'deleteOtp').mockResolvedValueOnce(undefined);

  //     const result = await service.verifyOtp('test@example.com', '123456');

  //     expect(result).toHaveProperty('access_token', 'mockToken');
  //   });
  // });

  // describe('login', () => {
  //   it('should throw an error if shop is not found', async () => {
  //     jest.spyOn(service, 'findShopByEmail').mockResolvedValueOnce(null);

  //     const loginDto: LoginDto = { email_id: 'test@example.com' };

  //     await expect(service.login(loginDto)).rejects.toThrow('Shop not found.');
  //   });

  //   it('should throw an error if email is not verified', async () => {
  //     jest.spyOn(service, 'findShopByEmail').mockResolvedValueOnce({ email_verified: false } as Store);

  //     const loginDto: LoginDto = { email_id: 'test@example.com' };

  //     await expect(service.login(loginDto)).rejects.toThrow('Email is not verified. Please verify your email before logging in.');
  //   });

  //   it('should send OTP to email for login', async () => {
  //     jest.spyOn(service, 'findShopByEmail').mockResolvedValueOnce({ email_verified: true } as Store);
  //     jest.spyOn(service, 'createOtp').mockResolvedValueOnce(undefined);
  //     jest.spyOn(MailUtils, 'sendOtpEmail').mockImplementation();

  //     const loginDto: LoginDto = { email_id: 'test@example.com' };

  //     const result = await service.login(loginDto);

  //     expect(result).toHaveProperty('message', 'OTP has been sent to your email. Please verify to login.');
  //     expect(MailUtils.sendOtpEmail).toHaveBeenCalledWith('test@example.com', expect.any(String));
  //   });
  // });

  describe('ShopAuthService Full Flow', () => {
    let app: INestApplication;

    beforeAll(async () => {
      const moduleFixture = await Test.createTestingModule({
        imports: [AppModule],
      }).compile();

      app = moduleFixture.createNestApplication();
      await app.init();
    });

    afterAll(async () => {
      await app.close();
    });

    it('should register a shop, send OTP, and verify OTP', async () => {
      const registerPayload = {
        email: 'testshop@example.com',
        name: 'Test Shop',
        about: 'This is a test shop',
        web_url: 'https://testshop.com',
        icon_url: 'https://testshop.com/icon.png',
        image_url: 'https://testshop.com/image.png',
        mobile_no: '1234567890',
        alternate_mobile_no: '0987654321',
        password: 'TestPassword123',
        street: '123 Test Street',
        city: 'Test City',
        state: 'Test State',
        postal_code: '123456',
        country: 'Test Country',
        category: 'Test Category',
        open_time: '09:00',
        close_time: '18:00',
        owner_id: 1,
        business_start_date: new Date('2023-01-01'),
        gst_no: 'TESTGST123',
        acc_no: '123456789012',
        ifsc_code: 'TESTIFSC',
        bank_branch: 'Test Branch',
        latitude: 12.345678,
        longitude: 98.765432,
        VAT: '10%',
      };

      // Step 1: Register the shop
      const registerResponse = await request(app.getHttpServer())
        .post('/shop-auth/register')
        .send(registerPayload)
        .expect(201);

      expect(registerResponse.body).toHaveProperty('email', 'testshop@example.com');
      expect(registerResponse.body).toHaveProperty('message', 'OTP has been sent to your email.');

      // Step 2: Retrieve the OTP (mocked for testing purposes)
      const otp = '123456'; // Replace with actual OTP retrieval logic if available

      // Step 3: Verify the OTP
      const verifyOtpResponse = await request(app.getHttpServer())
        .post('/shop-auth/verify-otp')
        .send({ email: 'testshop@example.com', otp })
        .expect(200);

      expect(verifyOtpResponse.body).toHaveProperty('access_token');
    });
  });
});
