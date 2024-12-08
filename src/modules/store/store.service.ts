import {  Injectable } from '@nestjs/common';
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
    return await super.create(createStoreDto);
  }
  async findAll() {
    return await super.findAll();
  }

  async findOne(id: number) {
    
    return await super.findOne(id);
  }

  async update(id: number, updateStoreDto: UpdateStoreDto) {
    return await super.update(id,updateStoreDto);
  }

  async remove(id: number) {
    return await super.remove(id);
  }
}
