import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { StoreProduct } from './entities/store-product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { StoreProductService } from './store-products.service';

const mockStoreProductRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('StoreProductService', () => {
  let service: StoreProductService;
  let storeProductRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        StoreProductService,
        { provide: getRepositoryToken(StoreProduct), useFactory: mockStoreProductRepository },
      ],
    }).compile();

    service = module.get<StoreProductService>(StoreProductService);
    storeProductRepository = module.get<Repository<StoreProduct>>(getRepositoryToken(StoreProduct));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new store product', async () => {
      const storeProduct = { name: 'Test Store Product', price: 100, quantity: 10 };
      const savedStoreProduct = { id: 1, ...storeProduct };

      storeProductRepository.create.mockReturnValue(savedStoreProduct);
      storeProductRepository.save.mockResolvedValue(savedStoreProduct);

      const result = await service.create(1,1,storeProduct);

      expect(storeProductRepository.create).toHaveBeenCalledWith(storeProduct);
      expect(storeProductRepository.save).toHaveBeenCalledWith(savedStoreProduct);
      expect(result).toEqual(savedStoreProduct);
    });
  });

  describe('findAll', () => {
    it('should return all store products', async () => {
      const storeProducts = [{ id: 1, name: 'Test Store Product' }];
      storeProductRepository.find.mockResolvedValue(storeProducts);

      const result = await service.findAll();

      expect(storeProductRepository.find).toHaveBeenCalled();
      expect(result).toEqual(storeProducts);
    });
  });

  describe('findOne', () => {
    it('should return a store product by id', async () => {
      const storeProduct = { id: 1, name: 'Test Store Product' };
      storeProductRepository.findOne.mockResolvedValue(storeProduct);

      const result = await service.findOne(1);

      expect(storeProductRepository.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(storeProduct);
    });

    it('should throw an error if the store product is not found', async () => {
      storeProductRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a store product', async () => {
      const updateStoreProductDto: Partial<StoreProduct> = { quantity: 20 };
      const storeProduct = { id: 1, name: 'Test Store Product' };
      const updatedStoreProduct = { id: 1, name: 'Updated Store Product' };

      storeProductRepository.findOne.mockResolvedValueOnce(storeProduct);
      storeProductRepository.save.mockResolvedValue(updatedStoreProduct);

      const result = await service.update(1, updateStoreProductDto);

      expect(storeProductRepository.findOne).toHaveBeenCalledWith(1);
      expect(storeProductRepository.save).toHaveBeenCalledWith({ ...storeProduct, ...updateStoreProductDto });
      expect(result).toEqual(updatedStoreProduct);
    });

    it('should throw an error if the store product is not found', async () => {
      const updateStoreProductDto =  { quantity: 20 };

      storeProductRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, updateStoreProductDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a store product', async () => {
      const storeProduct = { id: 1, name: 'Test Store Product' };

      storeProductRepository.findOne.mockResolvedValue(storeProduct);
      storeProductRepository.delete.mockResolvedValue(true);

      const result = await service.remove(1);

      expect(storeProductRepository.findOne).toHaveBeenCalledWith(1);
      expect(storeProductRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(storeProduct);
    });

    it('should throw an error if the store product is not found', async () => {
      storeProductRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
