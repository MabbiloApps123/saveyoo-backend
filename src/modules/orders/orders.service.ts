import { Injectable } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import { BaseService } from 'src/base.service';
import { Order } from './entities/order.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class OrdersService extends BaseService<Order> {
  protected repository: Repository<Order>;

  constructor(@InjectRepository(Order) orderRepository: Repository<Order>) {
    super(orderRepository.manager);
    this.repository = orderRepository;
  }

  async create(createOrderDto: CreateOrderDto) {
    return await super.create(createOrderDto);
  }

  async findAll(filters: Record<string, any>) {
    return await this.repository.findBy(filters);
  }

  async findOne(id: number) {
    return await super.findOne(id);
  }

  async update(id: number, updateOrderDto: UpdateOrderDto) {
    return await super.update(id, updateOrderDto);
  }

  async remove(id: number) {
    return await super.remove(id);
  }
}
