import { Injectable } from '@nestjs/common';
import { Repository, DataSource } from 'typeorm';
import { Product } from './entities/product.entity';

@Injectable()
export class ProductRepository extends Repository<Product> {
  constructor(dataSource: DataSource) {
    super(Product, dataSource.createEntityManager());
  }

  async getProductsInTimeRange(startTime: Date, endTime: Date) {
    return await this.createQueryBuilder('products')
      .where('products.pickup_start_time <= :endTime AND products.pickup_end_time >= :startTime', {
        startTime,
        endTime,
      })
      .getMany();
  }

  async findProductsWithinRadiusAndTimeRange(
    lat: number,
    lon: number,
    radius: number,
    startTime: Date,
    endTime: Date,
    page: number = 1,
    limit: number = 10,
  ): Promise<{ data: Product[]; total: number }> {
    const [data, total] = await this.createQueryBuilder('products')
      .leftJoinAndSelect('products.store', 'stores')
      .addSelect(
        `( 6371 * acos( cos( radians(:latitude) ) * cos( radians( stores.latitude ) ) * cos( radians( stores.longitude ) - radians(:longitude) ) + sin( radians(:latitude) ) * sin( radians( stores.latitude ) ) ) )`,
        'distance',
      )
      .where(
        `( 6371 * acos( cos( radians(:latitude) ) * cos( radians( stores.latitude ) ) * cos( radians( stores.longitude ) - radians(:longitude) ) + sin( radians(:latitude) ) * sin( radians( stores.latitude ) ) ) ) < :radiusInKm`,
        { latitude: lat, longitude: lon, radiusInKm: radius },
      )
      .andWhere('products.pickup_start_time >= :startTime AND products.pickup_end_time <= :endTime', {
        startTime,
        endTime,
      })
      .skip((page - 1) * limit) 
      .take(limit)
      .getManyAndCount();
    return { data, total };
  }
}
