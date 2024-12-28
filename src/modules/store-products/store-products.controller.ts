import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { StoreProductService } from './store-products.service';

@ApiTags('store-product')
@Controller('store-product')
export class StoreProductsController {
  constructor(private readonly storeProductsService: StoreProductService) {}

  @Post()
  create(@Body() createStoreProductDto: CreateStoreProductDto) {
    return this.storeProductsService.create(
      createStoreProductDto.store_id,
      createStoreProductDto.product_id,
      createStoreProductDto,
    );
  }

  @Get()
  findAll() {
    return this.storeProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeProductsService.findOne(+id);
  }
  @Get('/store/:id')
  findByStore(@Param('id') id: string) {
    return this.storeProductsService.getProductsByStore(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateStoreProductDto: UpdateStoreProductDto) {
    return this.storeProductsService.update(+id, updateStoreProductDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeProductsService.remove(+id);
  }
}
