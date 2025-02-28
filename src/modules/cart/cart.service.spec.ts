import { Test, TestingModule } from '@nestjs/testing';
import { CartService } from './cart.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Cart } from './entities/cart.entity';
import { StoreProductService } from '../store-products/store-products.service';
import { SchedulerRegistry } from '@nestjs/schedule';
import { Repository } from 'typeorm';
import { NotFoundException, BadRequestException } from '@nestjs/common';

const mockCartRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

const mockStoreProductService = () => ({
  findOne: jest.fn(),
  update: jest.fn(),
});

describe('CartService', () => {
  let cartService: CartService;
  let cartRepository;
  let storeProductService;
  let schedulerRegistry;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CartService,
        { provide: getRepositoryToken(Cart), useFactory: mockCartRepository },
        { provide: StoreProductService, useFactory: mockStoreProductService },
        SchedulerRegistry,
      ],
    }).compile();

    cartService = module.get<CartService>(CartService);
    cartRepository = module.get<Repository<Cart>>(getRepositoryToken(Cart));
    storeProductService = module.get<StoreProductService>(StoreProductService);
    schedulerRegistry = module.get<SchedulerRegistry>(SchedulerRegistry);
  });

  describe('create', () => {
    it('should create a cart item and block the product', async () => {
      const createCartDto = {userId:1, productId: 1, quantity: 2 };
      const storeProduct = { id: 1, quantity: 10 };
      const savedCart = { id: 1, ...createCartDto };

      storeProductService.findOne.mockResolvedValue(storeProduct);
      storeProductService.update.mockResolvedValue(true);
      cartRepository.create.mockReturnValue(savedCart);
      cartRepository.save.mockResolvedValue(savedCart);

      const result = await cartService.create(createCartDto);

      expect(storeProductService.findOne).toHaveBeenCalledWith(1);
      expect(storeProductService.update).toHaveBeenCalledWith(1, { quantity: 8 });
      expect(cartRepository.create).toHaveBeenCalledWith(createCartDto);
      expect(cartRepository.save).toHaveBeenCalledWith(savedCart);
      expect(result).toEqual(savedCart);
    });

    it('should throw an error if the product is not found', async () => {
      const createCartDto = {userId:1,  productId: 1, quantity: 2 };

      storeProductService.findOne.mockResolvedValue(null);

      await expect(cartService.create(createCartDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw an error if the requested quantity is not available', async () => {
      const createCartDto = {userId:1,  productId: 1, quantity: 20 };
      const storeProduct = { id: 1, quantity: 10 };

      storeProductService.findOne.mockResolvedValue(storeProduct);

      await expect(cartService.create(createCartDto)).rejects.toThrow(BadRequestException);
    });
  });

  describe('findAll', () => {
    it('should return all cart items', async () => {
      const cartItems = [{ id: 1, productId: 1, quantity: 2 }];
      cartRepository.find.mockResolvedValue(cartItems);

      const result = await cartService.findAll();

      expect(cartRepository.find).toHaveBeenCalledWith({ relations: ['product'] });
      expect(result).toEqual(cartItems);
    });
  });

  describe('findOne', () => {
    it('should return a cart item by id', async () => {
      const cartItem = { id: 1, productId: 1, quantity: 2 };
      cartRepository.findOne.mockResolvedValue(cartItem);

      const result = await cartService.findOne(1);

      expect(cartRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['product'] });
      expect(result).toEqual(cartItem);
    });

    it('should throw an error if the cart item is not found', async () => {
      cartRepository.findOne.mockResolvedValue(null);

      await expect(cartService.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a cart item', async () => {
      const updateCartDto = { quantity: 3 };
      const cartItem = { id: 1, productId: 1, quantity: 2 };

      cartRepository.update.mockResolvedValue(true);
      cartRepository.findOne.mockResolvedValue(cartItem);

      const result = await cartService.update(1, updateCartDto);

      expect(cartRepository.update).toHaveBeenCalledWith(1, updateCartDto);
      expect(result).toEqual(cartItem);
    });
  });

  describe('remove', () => {
    it('should remove a cart item', async () => {
      const cartItem = { id: 1, productId: 1, quantity: 2 };

      cartRepository.findOne.mockResolvedValue(cartItem);
      cartRepository.delete.mockResolvedValue(true);

      const result = await cartService.remove(1);

      expect(cartRepository.findOne).toHaveBeenCalledWith({ where: { id: 1 }, relations: ['product'] });
      expect(cartRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(cartItem);
    });
  });

  describe('releaseProduct', () => {
    it('should release the product and remove the cart item', async () => {
      const storeProduct = { id: 1, quantity: 8 };
      const cartId = 1;
      const productId = 1;
      const quantity = 2;

      storeProductService.findOne.mockResolvedValue(storeProduct);
      storeProductService.update.mockResolvedValue(true);
      cartRepository.delete.mockResolvedValue(true);

      await cartService['releaseProduct'](productId, quantity, cartId);

      expect(storeProductService.findOne).toHaveBeenCalledWith(productId);
      expect(storeProductService.update).toHaveBeenCalledWith(productId, { quantity: 10 });
      expect(cartRepository.delete).toHaveBeenCalledWith(cartId);
    });
  });
});