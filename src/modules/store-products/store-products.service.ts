import { Injectable } from '@nestjs/common';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { BaseService } from 'src/base.service';
import { StoreProduct } from './entities/store-product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class StoreProductsService extends BaseService<StoreProduct> {
  protected repository: Repository<StoreProduct>;
  constructor(@InjectRepository(StoreProduct) storeProductRepository: Repository<StoreProduct>) {
    super(storeProductRepository.manager);
    this.repository = storeProductRepository;
  }
  async create(createStoreProductDto: CreateStoreProductDto) {
    return await super.create(createStoreProductDto);
  }

  async findAll() {
    return await super.findAll();
  }

  async findOne(id: number) {
    return await super.findOne(id);
  }

  async update(id: number, updateStoreProductDto: UpdateStoreProductDto) {
    return await super.update(id, updateStoreProductDto);
  }

  async remove(id: number) {
    return await super.remove(id);
  }
}
