import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseService } from 'src/base.service';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductRepository } from './products.repository';

@Injectable()
export class ProductsService extends BaseService<Product> {
  protected repository: ProductRepository;
  columns: string[];
  constructor(@InjectRepository(ProductRepository) productRepository: ProductRepository) {
    super(productRepository.manager);
    this.repository = productRepository;
    let metadata = this.repository.metadata; // Get the column names dynamically
    this.columns = metadata.columns.map((column) => column.propertyName);
  }

  async create(createProductDto: CreateProductDto) {
    return await super.create(createProductDto);
  }

  async findAll() {
    return await super.findAll({ relations: ['store'] });
  }

  async findProductsWithPagination(latitude: number, longitude: number, radius: number) {
    console.log('------>', this.columns);
    return await super.findAllWithPagination(1, 10, { relations: ['store'], select: [] });
  }

  async findOne(id: number) {
    return await super.findOne(id);
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    return await super.update(id, updateProductDto);
  }

  async remove(id: number) {
    return await super.remove(id);
  }
  async collectTomorrow(latitude: number, longitude: number, radius: number) {
    const now = new Date();
    const tomorrowStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1);
    const tomorrowEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 23, 59, 59);
    let data = await this.repository.getProductsInTimeRange(tomorrowStart, tomorrowEnd);
    return data;
  }

  async collectToday(latitude: number, longitude: number, radius: number) {
    const now = new Date();
    const todayEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate(), 23, 59, 59);
    let data = await this.repository.findProductsWithinRadiusAndTimeRange(latitude, longitude, radius, now, todayEnd);
    return data;
  }
}
