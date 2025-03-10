import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository, SelectQueryBuilder } from 'typeorm';
import { Product } from '../products/entities/product.entity';
import { Store } from '../store/entities/store.entity';
import { StoreProduct } from './entities/store-product.entity';
import { TimeSensitiveProductsDto, TimeSensitiveProductsDtoExplore } from './dto/utility.dto';
import User from '../users/entities/user.entity';

@Injectable()
export class StoreProductService {
  constructor(
    @InjectRepository(StoreProduct)
    private readonly storeProductRepository: Repository<StoreProduct>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
    @InjectRepository(Product)
    private readonly productRepository: Repository<Product>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
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
  async getProductsByStore(storeId: number, filters?: Record<string, any>): Promise<any[]> {
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
      where: { store, ...dateFilter },
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

  async getTimeSensitiveProducts(dto: TimeSensitiveProductsDtoExplore) {
    const {
      userLat,
      userLng,
      sectionType,
      user_id,
      radius,
      selectedProductIds,
      foodType,
      dietPreference,
      startTime,
      endTime,
      search,
      page,
      limit,
    } = dto;
    const currentTime = new Date();
    // const currentTime = new Date(2025, 1, 5, 9, 30, 0);
    const currentHourMinute = this.formatTime(currentTime);
    let oneHourLater = this.formatTime(new Date(currentTime.getTime() + 60 * 60 * 1000));
     let queryBuilder = this.baseQuery();
    this.applyFavouriteFilter(queryBuilder, user_id);
    this.applyLocationFilter(queryBuilder, userLat, userLng, radius);

    if (selectedProductIds && selectedProductIds.length > 0) {
      queryBuilder.andWhere('storeProduct.id NOT IN (:...selectedProductIds)', { selectedProductIds });
    }

    // Apply optional filters
    this.applySectionFilters(queryBuilder, sectionType, currentHourMinute, oneHourLater, dietPreference);
    this.applyProductFilters(queryBuilder, foodType, dietPreference);
    this.applyTimeFilters(queryBuilder, startTime, endTime);
    this.applySearchFilter(queryBuilder, search);

    // Apply pagination
    this.applyPagination(queryBuilder, page, limit);

    // Execute query and process results
    const { entities, raw } = await queryBuilder.getRawAndEntities();
    const results = this.mapResults(entities, raw);

    selectedProductIds?.push(...results.map((product) => product.id));

    return this.filterAndMap(results);
  }

  private baseQuery() {
    let queryBuilder = this.storeProductRepository
      .createQueryBuilder('storeProduct')
      .innerJoinAndSelect('storeProduct.product', 'product')
      .innerJoinAndSelect('storeProduct.store', 'store')
      .andWhere('storeProduct.quantity > 0');

    return queryBuilder;
  }

  // Extract favourite filter
  private applyFavouriteFilter(queryBuilder: SelectQueryBuilder<StoreProduct>, user_id: number) {
    if (user_id) {
      return queryBuilder
        .leftJoinAndSelect(
          'storeProduct.favourites',
          'favourite',
          'favourite.store_product = storeProduct.id AND favourite.user_id = :user_id',
          { user_id },
        )
        .addSelect('COALESCE(favourite.is_active, FALSE)', 'is_favourite');
    }
  }

  // Extract location filter
  private applyLocationFilter(
    queryBuilder: SelectQueryBuilder<StoreProduct>,
    userLat: number,
    userLng: number,
    radius: number,
  ) {
    if (userLat && userLng) {
      return queryBuilder
        .addSelect(
          `ST_DistanceSphere(
          ST_MakePoint(store.longitude, store.latitude),
          ST_MakePoint(:userLng, :userLat)
        ) / 1000`,
          'distance',
        )
        .setParameters({ userLng, userLat })
        .groupBy(
          'storeProduct.id, storeProduct.quantity, storeProduct.store_id, store.id, store.longitude, store.latitude, favourite.is_active, product.id,favourite.id',
        )
        .having(
          `ST_DistanceSphere(
          ST_MakePoint(store.longitude, store.latitude),
          ST_MakePoint(:userLng, :userLat)
        ) / 1000 <= ${radius}`,
        );
    }
  }

  //  Handles different filters based on sectionType
  private async applySectionFilters(
    queryBuilder: SelectQueryBuilder<StoreProduct>,
    sectionType: string,
    currentHourMinute: string,
    oneHourLater: string,
    preferences: string[],
  ) {
    if (sectionType) {
      switch (sectionType) {
        case 'just_for_you':
          this.applyJustForYouFilters(queryBuilder, preferences, currentHourMinute);
          break;

        case 'last_chance_deals':
          queryBuilder
            .andWhere('storeProduct.quantity < 15') // Low-stock items
            .andWhere('storeProduct.pickup_end_time >= :currentHourMinute', { currentHourMinute }) // Avoid past-time items
            // .orWhere('storeProduct.clearance_sale = TRUE') // Clearance sale item
            .orderBy('storeProduct.pickup_end_time', 'ASC')
            .addOrderBy('storeProduct.quantity', 'ASC');
          break;

        case 'available_now':
          queryBuilder
            .andWhere(
              'storeProduct.pickup_start_time <= :oneHourLater AND storeProduct.pickup_end_time >= :currentHourMinute',
              {
                currentHourMinute,
                oneHourLater,
              },
            )
            .addOrderBy('distance', 'ASC');
          break;

        case 'dinnertime_deals':
          queryBuilder
            .andWhere('EXTRACT(HOUR FROM storeProduct.pickup_start_time) >= 17')
            .addOrderBy('distance', 'DESC')
            .addOrderBy('storeProduct.quantity', 'ASC');
          break;

        default:
          throw new Error(`Invalid section type: ${sectionType}`);
      }
    }
  }
  private async applyJustForYouFilters(
    queryBuilder: SelectQueryBuilder<StoreProduct>,
    preferences: string[],
    currentHourMinute: string,
  ) {
    if (preferences?.length) {
      queryBuilder
        .andWhere('storeProduct.pickup_end_time >= :currentHourMinute', { currentHourMinute })
        .andWhere('storeProduct.diet_preference IN (:...preferences)', {
          preferences: preferences,
        });
    }
  }
  private applyTimeFilters(queryBuilder: SelectQueryBuilder<StoreProduct>, startTime?: string, endTime?: string) {
    if (startTime && endTime) {
      queryBuilder.andWhere(
        `storeProduct.pickup_start_time >= :startTime AND storeProduct.pickup_end_time <= :endTime`,
        { startTime, endTime },
      );
    }
  }

  private applyProductFilters(
    queryBuilder: SelectQueryBuilder<StoreProduct>,
    foodType?: string,
    dietPreference?: string[],
  ) {
    if (foodType) {
      queryBuilder.andWhere('storeProduct.food_type = :foodType', { foodType });
    }

    if (dietPreference) {
      queryBuilder.andWhere('storeProduct.diet_preference IN (:...preferences)', { preferences: dietPreference });
    }
  }

  private applySearchFilter(queryBuilder: SelectQueryBuilder<StoreProduct>, search?: string) {
    if (search) {
      queryBuilder.andWhere(`(product.name ILIKE :search OR store.name ILIKE :search)`, { search: `%${search}%` });
    }
  }

  private applyPagination(queryBuilder: SelectQueryBuilder<StoreProduct>, page: number, limit: number) {
    if (page && limit) {
      const offset = (page - 1) * limit;
      queryBuilder.skip(offset).take(limit);
    } else {
      queryBuilder.limit(5);
    }
  }

  // Formats date to HH:MM:SS
  private formatTime(date: Date): string {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const seconds = date.getSeconds().toString().padStart(2, '0');
    return `${hours}:${minutes}:${seconds}`;
  }

  //  Maps raw results to include extra fields
  private mapResults(entities: StoreProduct[], raw: any[]): any[] {
    return entities.map((entity, index) => ({
      ...entity,
      distance: raw[index]?.distance as number,
      is_favourite: raw[index]?.is_favourite as boolean,
    }));
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
