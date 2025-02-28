import { Controller, Get, Post, Body, Param, Delete, Patch } from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ApiTags } from '@nestjs/swagger';
import HandleResponse from 'src/core/utils/handle_response';

@ApiTags('cart')
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async create(@Body() createCartDto: CreateCartDto) {
    const data = await this.cartService.create(createCartDto);
    return HandleResponse.buildSuccessObj(201, 'Cart item created successfully!', data);
  }

  @Get()
  async findAll() {
    const data = await this.cartService.findAll();
    return HandleResponse.buildSuccessObj(200, 'Cart items retrieved successfully!', data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.cartService.findOne(+id);
    return HandleResponse.buildSuccessObj(200, 'Cart item retrieved successfully!', data);
  }

  @Get('user/:userId')
  async findByUserId(@Param('userId') userId: string) {
    const data = await this.cartService.findByUserId(+userId);
    return HandleResponse.buildSuccessObj(200, 'Cart items retrieved successfully!', data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCartDto: UpdateCartDto) {
    const data = await this.cartService.update(+id, updateCartDto);
    return HandleResponse.buildSuccessObj(200, 'Cart item updated successfully!', data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.cartService.remove(+id);
    return HandleResponse.buildSuccessObj(200, 'Cart item removed successfully!', data);
  }
}