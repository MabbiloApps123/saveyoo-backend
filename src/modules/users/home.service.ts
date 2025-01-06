import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StoreProduct } from '../store-products/entities/store-product.entity';

@Injectable()
export class HomeService {
  constructor(
    @InjectRepository(StoreProduct)
    private readonly storeProductRepository: Repository<StoreProduct>,
  ) {}

  async getHomePageData(latitude: number, longitude: number, radius: number): Promise<any> {
    // Fetch "just_for_you" data
    const [justForYou, lastChanceDeals, availableNow, dinnertimeDeals] = await Promise.all([
      this.getProductsByDeal('just_for_you'),
      this.getProductsByDeal('last_chance_deals'),
      this.getProductsByDeal('available_now'),
      this.getProductsByDeal('dinnertime_deals'),
    ]);
    // Return structured response
    return {
      just_for_you: justForYou,
      last_chance_deals: lastChanceDeals,
      available_now: availableNow,
      dinnertime_deals: dinnertimeDeals,
    };
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
