import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { StoreProductsService } from './store-products.service';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('store-products')
@Controller('store-products')
export class StoreProductsController {
  constructor(private readonly storeProductsService: StoreProductsService) {}

  @Post()
  create(@Body() createStoreProductDto: CreateStoreProductDto) {
    return this.storeProductsService.create(createStoreProductDto);
  }

  @Get()
  findAll() {
    return this.storeProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.storeProductsService.findOne(+id);
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
