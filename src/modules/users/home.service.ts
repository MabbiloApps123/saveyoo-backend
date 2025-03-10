import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Store } from '../store/entities/store.entity';
import { StoreProductService } from '../store-products/store-products.service';
import { TimeSensitiveProductsDto } from '../store-products/dto/utility.dto';

@Injectable()
export class HomeService {
  constructor(
    @Inject(StoreProductService) private readonly storeProductsService: StoreProductService,
    @InjectRepository(Store)
    private readonly storeRepository: Repository<Store>,
  ) {}

  async getHomePageData(dto: TimeSensitiveProductsDto): Promise<any> {
    const selectedProductIds: number[] = []; // Track selected product IDs

    const sections = ['just_for_you', 'last_chance_deals', 'available_now','dinnertime_deals'];

    const results = await Promise.all(
      sections.map(
        async (section) =>
          await this.storeProductsService.getTimeSensitiveProducts({
            ...dto,
            sectionType: section,
            selectedProductIds,
          }),
      ),
    );

    const [just_for_you,lastChanceDeals, availableNow, dinnertimeDeals] = results;
    const supermarkets = await this.storeRepository.findBy({ category: 'supermarket' });
    return {
      just_for_you: just_for_you,
      last_chance_deals: lastChanceDeals,
      available_now: availableNow,
      dinnertime_deals: dinnertimeDeals,
      supermarkets: supermarkets,
    };
  }
}
