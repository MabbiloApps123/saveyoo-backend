import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import { BaseService } from 'src/base.service';
import { Store } from './entities/store.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StoreService extends BaseService<Store> {
  protected repository: Repository<Store>;
  constructor(@InjectRepository(Store) storeRepository: Repository<Store>) {
    super(storeRepository.manager);
    this.repository = storeRepository;
  }
  async create(createStoreDto: CreateStoreDto) {
    // Remove extra quotes if present
    // const sanitizedLocation = {
    //   type: 'Point',
    //   coordinates: [-74.006, 40.7128], // Replace with actual data
    // };
    // createStoreDto.location = sanitizedLocation as unknown as string;
    return await super.create(createStoreDto);
  }
  async findAll(filters: Record<string, any>) {
    return await this.repository.findBy(filters);
  }

  async findOne(id: number) {
    return await super.findOne(id);
  }
  // async findBy() {
  //   return await this.repository.findBy({});
  // }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    return await super.update(id, updateStoreDto);
  }

  async remove(id: number) {
    return await super.remove(id);
  }

  async findStoresWithinRadius(latitude: number, longitude: number, radius: number): Promise<Store[]> {
    const radiusInKm = radius / 1000;
    return this.repository
      .createQueryBuilder('store')
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
