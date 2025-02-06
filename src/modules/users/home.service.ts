import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { StoreProduct } from '../store-products/entities/store-product.entity';
import { Store } from '../store/entities/store.entity';
import { StoreProductWithDistance } from 'src/core/interfaces/shared.dto';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(StoreProduct)
    private readonly storeProductRepository: Repository<StoreProduct>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async getHomePageData(latitude: number, longitude: number, radius: number, user_id: number): Promise<any> {
    const selectedProductIds: number[] = []; // Track selected product IDs

    // Fetch "just_for_you" data
    // const [justForYou, lastChanceDeals, availableNow, dinnertimeDeals, supermarkets] = await Promise.all([
    // const justForYou = await this.getTimeSensitiveProducts(latitude, longitude, 'just_for_you', selectedProductIds);
    const availableNow = await this.getTimeSensitiveProducts(
      latitude,
      longitude,
      'available_now',
      selectedProductIds,
      user_id,
    );
    const lastChanceDeals = await this.getTimeSensitiveProducts(
      latitude,
      longitude,
      'last_chance_deals',
      selectedProductIds,
      user_id,
    );
    const dinnertimeDeals = await this.getTimeSensitiveProducts(
      latitude,
      longitude,
      'dinnertime_deals',
      selectedProductIds,
      user_id,
    );
    const supermarkets = await this.storeRepository.findBy({ category: 'supermarket' });
    // ]);
    // Return structured response
    return {
      just_for_you: [],
      last_chance_deals: lastChanceDeals,
      available_now: availableNow,
      dinnertime_deals: dinnertimeDeals,
      supermarkets: supermarkets,
    };
  }

  async getProductsByDeals(category: string, userLat: number, userLng: number, radius: number): Promise<any[]> {
    const query = `
    SELECT sp.*, s.id AS store_id, s.name AS store_name, s.image_url, s.category,
           s.open_time, s.close_time,
           ST_DistanceSphere(
             s.location,
             ST_SetSRID(ST_MakePoint($1, $2), 4326)
           ) AS distance
    FROM store_product sp
    INNER JOIN store s ON sp.store_id = s.id
    WHERE sp.deal_type = $3
    AND ST_DistanceSphere(
      s.location,
      ST_SetSRID(ST_MakePoint($1, $2), 4326)
    ) <= $4
  `;

    const storeProducts = await getManager().query(query, [
      userLng, // User's longitude
      userLat, // User's latitude
      category, // Deal type
      radius, // Radius in meters
    ]);

    return this.filterAndMap(storeProducts);
  }

  // async getProductsByDeal(category: string): Promise<any[]> {
  //   const storeProducts = await this.storeProductRepository.find({
  //     where: { deal_type: category },
  //     relations: ['product', 'store'],
  //   });

  //   return this.filterAndMap(storeProducts);
  // }

  async getTimeSensitiveProducts(
    userLat: number,
    userLng: number,
    sectionType: string,
    selectedProductIds: number[],
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

    if (selectedProductIds.length > 0) {
      queryBuilder.andWhere('storeProduct.id NOT IN (:...selectedProductIds)', { selectedProductIds });
    }


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

    selectedProductIds.push(...results.map((product) => product.id));

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
