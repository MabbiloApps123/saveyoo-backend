import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { StoreProductService } from './store-products.service';
import HandleResponse from 'src/core/utils/handle_response';

@ApiTags('store-product')
@Controller('store-product')
export class StoreProductsController {
  constructor(private readonly storeProductsService: StoreProductService) {}

  @Post()
 async create(@Body() createStoreProductDto: CreateStoreProductDto) {
    return this.storeProductsService.create(
      createStoreProductDto.store_id,
      createStoreProductDto.product_id,
      createStoreProductDto,
    );
  }

  @Get()
 async findAll() {
    let data = await this.storeProductsService.findAll();
    return HandleResponse.buildSuccessObj(200, 'Data retrieved successfully!', data);
  }

  @Get('/by-deal') 
  async getProducstByDeal(
    @Query('latitude') latitude: number,
    @Query('longitude') longitude: number,
    @Query('radius') radius: number,
    @Query('category') category: string,
    @Query('user_id') user_id: number, 
  ) {
    const stores = await this.storeProductsService.getTimeSensitiveProducts(latitude,longitude,category,user_id);
    return HandleResponse.buildSuccessObj(200, 'Data retrieved successfully!', stores);
  }

  @Get(':id')
 async findOne(@Param('id') id: string) {
    let data = await this.storeProductsService.findOne(+id);
    return HandleResponse.buildSuccessObj(200, 'Data retrieved successfully!', data);

  }
  @Get('/store/:id')
  async findByStore(@Param('id') id: string, @Query() filters: Record<string,any>) {
    let data = await this.storeProductsService.getProductsByStore(+id, filters);
    return HandleResponse.buildSuccessObj(200, 'Data retrieved successfully!', data);

  }

  @Patch(':id')
 async update(@Param('id') id: string, @Body() updateStoreProductDto: UpdateStoreProductDto) {
    await this.storeProductsService.update(+id, updateStoreProductDto);
    return HandleResponse.buildSuccessObj(200, 'Data retrieved successfully!', {});

  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.storeProductsService.remove(+id);
  }
}
