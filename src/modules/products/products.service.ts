import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { BaseService } from 'src/base.service';
import { Product } from './entities/product.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class ProductsService extends BaseService<Product> {
  protected repository: Repository<Product>;
  constructor(@InjectRepository(Product) productRepository: Repository<Product>) {
    super(productRepository.manager);
    this.repository = productRepository;
  }
  async create(createProductDto: CreateProductDto) {
    return await super.create(createProductDto);
  }

  async findAll() {
    return await super.findAll({relations:['store']});
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
}
