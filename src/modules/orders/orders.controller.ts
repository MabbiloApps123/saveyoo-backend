import { Controller, Post, Get, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderDto } from './dto/update-order.dto';
import HandleResponse from 'src/core/utils/handle_response';
import { ApiTags } from '@nestjs/swagger';
import { buildFilters } from 'src/core/utils/helpers';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    const data = await this.ordersService.create(createOrderDto);
    return HandleResponse.buildSuccessObj(201, 'Order created successfully!', data);
  }

  @Get()
  async findAll(@Query() query: Record<string, any>) {
    const filters = buildFilters(query);
    const data = await this.ordersService.findAll(filters);
    return HandleResponse.buildSuccessObj(200, 'Orders retrieved successfully!', data || []);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.ordersService.findOne(+id);
    return HandleResponse.buildSuccessObj(200, 'Order retrieved successfully!', data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateOrderDto: UpdateOrderDto) {
    const data = await this.ordersService.update(+id, updateOrderDto);
    return HandleResponse.buildSuccessObj(200, 'Order updated successfully!', data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.ordersService.remove(+id);
    return HandleResponse.buildSuccessObj(200, 'Order removed successfully!', data);
  }
}
