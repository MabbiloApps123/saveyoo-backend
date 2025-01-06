import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Store } from '../store/entities/store.entity';
import { StoreProduct } from './entities/store-product.entity';

@Injectable()
export class StoreProductService {
  constructor(
    @InjectRepository(StoreProduct)
    private readonly storeProductRepository: Repository<StoreProduct>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
  ) {}

  // Create a new store-product entry
  async create(storeId: number, productId: number, createDto: Partial<StoreProduct>): Promise<StoreProduct> {
    const store = (await this.storeRepository.findOne({ where: { id: storeId } })) as Partial<Store>;
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    const storeProduct = this.storeProductRepository.create({
      ...createDto,
      store,
      product,
    });

    return (await this.storeProductRepository.save(storeProduct)) as unknown as StoreProduct;
  }

  // Get all store-product entries
  async findAll(): Promise<StoreProduct[]> {
    return await this.storeProductRepository.find({
      relations: ['store', 'product'],
    });
  }

  // Get a specific store-product entry by ID
  async findOne(id: number): Promise<StoreProduct> {
    const storeProduct = await this.storeProductRepository.findOne({
      where: { id },
      relations: ['store', 'product'],
    });

    if (!storeProduct) {
      throw new NotFoundException(`StoreProduct with ID ${id} not found`);
    }

    return storeProduct;
  }

  // Update a store-product entry
  async update(id: number, updateDto: Partial<StoreProduct>): Promise<StoreProduct> {
    const storeProduct = await this.findOne(id);

    const updatedStoreProduct = this.storeProductRepository.merge(storeProduct, updateDto);
    return await this.storeProductRepository.save(updatedStoreProduct);
  }

  // Delete a store-product entry
  async remove(id: number): Promise<void> {
    const storeProduct = await this.findOne(id);

    await this.storeProductRepository.remove(storeProduct);
  }

  // Get all products for a specific store
  async getProductsByStore(storeId: number): Promise<any[]> {
    const store = await this.storeRepository.findOne({ where: { id: storeId } });
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }

    let storeProducts = await this.storeProductRepository.find({
      where: { store },
      relations: ['product','store'],
    });

    return storeProducts.map((storeProduct) => {
      const { product, ...storeProductData } = storeProduct;
      return { ...storeProductData, ...product };
    });
  }

  // Get all stores for a specific product
  async getStoresByProduct(productId: number): Promise<any[]> {
    const product = await this.productRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    let productStores= await this.storeProductRepository.find({
      where: { product },
      relations: ['store'],
    });

    return productStores.map((storeProduct) => {
      const { product, ...storeProductData } = storeProduct;
      return { ...storeProductData, ...product };
    });
  }

  async getProductsByDeal(category: string): Promise<any[]> {
    const storeProducts = await this.storeProductRepository.find({
      where: { deal_type: category },
      relations: ['product', 'store'],
    });

    return this.filterAndMap(storeProducts);
  }

  private filterAndMap(storeProducts: StoreProduct[]) {
    return storeProducts.map((storeProduct) => ({
      product_id: storeProduct.product.id,
      store_id: storeProduct.store.id,
      original_price: storeProduct.original_price,
      discounted_price: storeProduct.discounted_price,
      currency: storeProduct.currency,
      quantity: storeProduct.quantity,
      pickup_start_time: storeProduct.pickup_start_time,
      pickup_end_time: storeProduct.pickup_end_time,
      product: storeProduct.product.name,
      product_image: storeProduct.product.product_image,
      is_favourite: true,
      distance: 4.0,
      ratings: 4.5,
      store: {
        id: storeProduct.store.id,
        name: storeProduct.store.name,
        image_url: storeProduct.store.image_url,
        category: storeProduct.store.category,
        open_time: storeProduct.store.open_time,
        close_time: storeProduct.store.close_time,
      },
    }));
  }
}
