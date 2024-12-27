import { DataSource, Repository } from 'typeorm';
import { Store } from './entities/store.entity';
import { Injectable } from '@nestjs/common';

@Injectable()
export class StoreRepository extends Repository<Store> {
  constructor(dataSource: DataSource) {
    super(Store, dataSource.createEntityManager());
  }
  async findStoresWithinRadius(latitude: number, longitude: number, radius: number): Promise<Store[]> {
    const radiusInKm = radius / 1000;

    return this.createQueryBuilder('stores')
      .select()
      .addSelect(
        `( 6371 * acos( cos( radians(:latitude) ) * cos( radians( stores.latitude ) ) * cos( radians( stores.longitude ) - radians(:longitude) ) + sin( radians(:latitude) ) * sin( radians( stores.latitude ) ) ) )`,
        'distance',
      )
      .where(
        `( 6371 * acos( cos( radians(:latitude) ) * cos( radians( stores.latitude ) ) * cos( radians( stores.longitude ) - radians(:longitude) ) + sin( radians(:latitude) ) * sin( radians( stores.latitude ) ) ) ) < :radiusInKm`,
      )
      .setParameters({ latitude, longitude, radiusInKm })
      .getMany();
  }
}
