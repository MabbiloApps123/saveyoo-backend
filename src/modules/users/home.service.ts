import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { getManager, Repository } from 'typeorm';
import { StoreProduct } from '../store-products/entities/store-product.entity';
import { Store } from '../store/entities/store.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(StoreProduct)
    private readonly storeProductRepository: Repository<StoreProduct>,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async getHomePageData(latitude: number, longitude: number, radius: number): Promise<any> {
    // Fetch "just_for_you" data
    const [justForYou, lastChanceDeals, availableNow, dinnertimeDeals,supermarkets] = await Promise.all([
      this.getProductsByDeal('just_for_you'),
      this.getProductsByDeal('last_chance_deals'),
      this.getProductsByDeal('available_now'),
      this.getProductsByDeal('dinnertime_deals'),
      this.storeRepository.findBy({category:"supermarket"}),
    ]);
    // Return structured response
    return {
      just_for_you: justForYou,
      last_chance_deals: lastChanceDeals,
      available_now: availableNow,
      dinnertime_deals: dinnertimeDeals,
      supermarkets: supermarkets
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
