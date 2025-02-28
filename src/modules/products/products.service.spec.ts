import { Test, TestingModule } from '@nestjs/testing';
import { ProductsService } from './products.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockProductRepository = () => ({
  create: jest.fn(),
  save: jest.fn(),
  find: jest.fn(),
  findOne: jest.fn(),
  update: jest.fn(),
  delete: jest.fn(),
});

describe('ProductsService', () => {
  let service: ProductsService;
  let productRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ProductsService,
        { provide: getRepositoryToken(Product), useFactory: mockProductRepository },
      ],
    }).compile();

    service = module.get<ProductsService>(ProductsService);
    productRepository = module.get<Repository<Product>>(getRepositoryToken(Product));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new product', async () => {
      const product = { 
        name: 'Test Product',
        product_image: 'image_url',
        description: 'Test Description',
        category: 'Test Category',
        store: 'Test Store',
        price: 100,
        stock: 10,
        sku: 'TESTSKU',
        weight: 1,
        dimensions: '10x10x10',
        manufacturer: 'Test Manufacturer'
      };
      const savedProduct = { id: 1, ...product };

      productRepository.create.mockReturnValue(savedProduct);
      productRepository.save.mockResolvedValue(savedProduct);

      const result = await service.create(product);

      expect(productRepository.create).toHaveBeenCalledWith(product);
      expect(productRepository.save).toHaveBeenCalledWith(savedProduct);
      expect(result).toEqual(savedProduct);
    });
  });

  describe('findAll', () => {
    it('should return all products', async () => {
      const products = [{ id: 1, name: 'Test Product' }];
      productRepository.find.mockResolvedValue(products);

      const result = await service.findAll();

      expect(productRepository.find).toHaveBeenCalled();
      expect(result).toEqual(products);
    });
  });

  describe('findOne', () => {
    it('should return a product by id', async () => {
      const product = { id: 1, name: 'Test Product' };
      productRepository.findOne.mockResolvedValue(product);

      const result = await service.findOne(1);

      expect(productRepository.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(product);
    });

    it('should throw an error if the product is not found', async () => {
      productRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(1)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a product', async () => {
      const updateProductDto = { name: 'Updated Product' };
      const product = { id: 1, name: 'Test Product' };
      const updatedProduct = { id: 1, name: 'Updated Product' };

      productRepository.findOne.mockResolvedValueOnce(product);
      productRepository.save.mockResolvedValue(updatedProduct);

      const result = await service.update(1, updateProductDto);

      expect(productRepository.findOne).toHaveBeenCalledWith(1);
      expect(productRepository.save).toHaveBeenCalledWith({ ...product, ...updateProductDto });
      expect(result).toEqual(updatedProduct);
    });

    it('should throw an error if the product is not found', async () => {
      const updateProductDto = { name: 'Updated Product' };

      productRepository.findOne.mockResolvedValue(null);

      await expect(service.update(1, updateProductDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove a product', async () => {
      const product = { id: 1, name: 'Test Product' };

      productRepository.findOne.mockResolvedValue(product);
      productRepository.delete.mockResolvedValue(true);

      const result = await service.remove(1);

      expect(productRepository.findOne).toHaveBeenCalledWith(1);
      expect(productRepository.delete).toHaveBeenCalledWith(1);
      expect(result).toEqual(product);
    });

    it('should throw an error if the product is not found', async () => {
      productRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(1)).rejects.toThrow(NotFoundException);
    });
  });
});
