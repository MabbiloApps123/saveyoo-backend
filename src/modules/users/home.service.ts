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
    const justForYou = await this.getProductsByCategory('just_for_you');

    // Fetch "last_chance_deals" data
    const lastChanceDeals = await this.getProductsByCategory('last_chance_deals');

    // Fetch "available_now" data
    const availableNow = await this.getProductsByCategory('available_now');

    // Fetch "dinnertime_deals" data
    const dinnertimeDeals = await this.getProductsByCategory('dinnertime_deals');

    // Return structured response
    return {
      just_for_you: justForYou,
      last_chance_deals: lastChanceDeals,
      available_now: availableNow,
      dinnertime_deals: dinnertimeDeals,
    };
  }

  private async getProductsByCategory(category: string): Promise<any[]> {
    const storeProducts = await this.storeProductRepository.find({
      where: { deal_type: category },
      relations: ['product', 'store'],
    });

    // Filter and map data based on the required structure
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
      distance:4.00,
      ratings:4.5,
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
