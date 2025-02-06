import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
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
  async getProductsByStore(storeId: number, filters?:Record<string,any>): Promise<any[]> {
    const store = await this.storeRepository.findOne({ where: { id: storeId } });
    if (!store) {
      throw new NotFoundException(`Store with ID ${storeId} not found`);
    }
    const dateFilter = {};
    if (filters?.startDate && filters?.endDate) {
      dateFilter['created_at'] = Between(new Date(filters?.startDate), new Date(filters?.endDate));
    } else if (filters?.startDate) {
      dateFilter['created_at'] = Between(new Date(filters?.startDate), new Date());
    }

    let storeProducts = await this.storeProductRepository.find({
      where: { store,...dateFilter },
      relations: ['product', 'store'],
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

    let productStores = await this.storeProductRepository.find({
      where: { product },
      relations: ['store'],
    });

    return productStores.map((storeProduct) => {
      const { product, ...storeProductData } = storeProduct;
      return { ...storeProductData, ...product };
    });
  }

  async getProductsByDeal(category: string) {
    // const storeProducts = await this.storeProductRepository.find({
    //   where: { deal_type: category },
    //   relations: ['product', 'store'],
    // });

    // return await this.getTimeSensitiveProducts(11.9834221, 78.9677772,category,);
  }

  async getTimeSensitiveProducts(
    userLat: number,
    userLng: number,
    sectionType: string,
    user_id: number,
  ): Promise<any[]> {
    const currentTime = new Date(2025, 1, 5, 9, 30, 0);
    const currentHourMinute = currentTime.toTimeString().split(' ')[0]; // Extracts HH:MM:SS

    let queryBuilder = this.storeProductRepository
      .createQueryBuilder('storeProduct')
      .innerJoinAndSelect('storeProduct.product', 'product')
      .innerJoinAndSelect('storeProduct.store', 'store')
      .leftJoinAndSelect(
        'storeProduct.favourites',
        'favourite',
        'favourite.store_product = storeProduct.id AND favourite.user_id = :user_id',
        { user_id },
      )
      .addSelect('COALESCE(favourite.is_active, FALSE)', 'is_favourite')
      .andWhere('storeProduct.quantity > 0') // Exclude sold-out deals
      .addSelect(
        `ST_Distance(
          store.location,
          ST_SetSRID(ST_MakePoint(:userLng, :userLat), 4326) 
        ) / 1000`,
        'distance',
      )
      .setParameters({ userLng, userLat })
      .limit(5);

    // if (selectedProductIds.length > 0) {
    //   queryBuilder.andWhere('storeProduct.id NOT IN (:...selectedProductIds)', { selectedProductIds });
    // }


    // Apply filters based on section type
    switch (sectionType) {
      case 'just_for_you':
        queryBuilder = queryBuilder
          .andWhere('storeProduct.category IN (:...preferences)', {
            preferences: ['vegan', 'vegetarian', 'gluten-free'],
          })
          // .addOrderBy('storeProduct.popularity', 'DESC');
        break;

      case 'last_chance_deals':
        queryBuilder = queryBuilder
          .orderBy('storeProduct.pickup_end_time', 'ASC')
          .addOrderBy('storeProduct.quantity', 'ASC');
        break;

      case 'available_now':
        queryBuilder = queryBuilder
          .andWhere(
            `
          storeProduct.pickup_start_time <= :currentHourMinute
          AND storeProduct.pickup_end_time >= :oneHourLater
        `,
            {
              currentHourMinute,
              oneHourLater: new Date(currentTime.getTime() + 60 * 60 * 1000).toTimeString().split(' ')[0], // Adds 1 hour
            },
          )
          .addOrderBy('distance', 'ASC'); // Show closest first 
        break;

      case 'dinnertime_deals':
        queryBuilder = queryBuilder
          .andWhere('EXTRACT(HOUR FROM storeProduct.pickup_start_time) BETWEEN 17 AND 22')
          .addOrderBy('distance', 'ASC')
          .addOrderBy('storeProduct.quantity', 'ASC');
        break;

      default:
        throw new Error(`Invalid section type: ${sectionType}`);
    }

    // Execute the query and return the results
    const { entities, raw }: { entities: StoreProduct[]; raw: any[] } = await queryBuilder.getRawAndEntities();
    const results: any[] = entities.map((entity, index) => ({
      ...entity,
      distance: raw[index]?.distance as number,
      is_favourite: raw[index]?.is_favourite as boolean,
    }));

    // selectedProductIds.push(...results.map((product) => product.id));

    return this.filterAndMap(results);
  }

  private filterAndMap(storeProducts: (StoreProduct & { distance: number; is_favourite: boolean })[]) {
    return storeProducts.map((storeProduct) => ({
      product_id: storeProduct.product.id,
      store_product_id: storeProduct.id,
      store_id: storeProduct.store.id,
      original_price: storeProduct.original_price,
      discounted_price: storeProduct.discounted_price,
      currency: storeProduct.currency,
      quantity: storeProduct.quantity,
      pickup_start_time: storeProduct.pickup_start_time,
      pickup_end_time: storeProduct.pickup_end_time,
      product: storeProduct.product.name,
      product_image: storeProduct.product.product_image,
      is_favourite: storeProduct.is_favourite,
      distance: storeProduct.distance,
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
