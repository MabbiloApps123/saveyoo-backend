import { Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StoreRepository extends Repository<Store> {

  async findStoresWithinRadius(latitude: number, longitude: number, radius: number): Promise<Store[]> {
    const radiusInKm = radius / 1000;

    return this.createQueryBuilder('stores')
      .select()
      .addSelect(
        `( 6371 * acos( cos( radians(:latitude) ) * cos( radians( store.latitude ) ) * cos( radians( store.longitude ) - radians(:longitude) ) + sin( radians(:latitude) ) * sin( radians( store.latitude ) ) ) )`,
        'distance',
      )
      .having('distance < :radiusInKm', { radiusInKm })
      .setParameters({ latitude, longitude })
      .getMany();
  }
}
