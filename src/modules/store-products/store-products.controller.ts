import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UsePipes, ValidationPipe } from '@nestjs/common';
import { CreateStoreProductDto } from './dto/create-store-product.dto';
import { UpdateStoreProductDto } from './dto/update-store-product.dto';
import { ApiTags } from '@nestjs/swagger';
import { StoreProductService } from './store-products.service';
import HandleResponse from 'src/core/utils/handle_response';
import { TimeSensitiveProductsDtoExplore } from './dto/utility.dto';

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
  @UsePipes(new ValidationPipe({ transform: true })) // Enables automatic transformation & validation
  async findAll(@Query() query: TimeSensitiveProductsDtoExplore) {
    const stores = await this.storeProductsService.getTimeSensitiveProducts(query);
    return HandleResponse.buildSuccessObj(200, 'Data retrieved successfully!', stores);
  }

  // @Get('/by-deal')
  // @UsePipes(new ValidationPipe({ transform: true })) // Enables automatic transformation & validation
  // async getProducstByDeal(@Query() query: TimeSensitiveProductsDtoExplore) {
  //   const stores = await this.storeProductsService.getTimeSensitiveProducts(query);
  //   return HandleResponse.buildSuccessObj(200, 'Data retrieved successfully!', stores);
  // }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let data = await this.storeProductsService.findOne(+id);
    return HandleResponse.buildSuccessObj(200, 'Data retrieved successfully!', data);
  }
  @Get('/store/:id')
  async findByStore(@Param('id') id: string, @Query() filters: Record<string, any>) {
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
