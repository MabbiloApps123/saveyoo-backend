import { Controller, Post, Get, Patch, Delete, Param, Body, Query } from '@nestjs/common';
import { StoreService } from './store.service';
import { CreateStoreDto } from './dto/create-store.dto';
import { UpdateStoreDto } from './dto/update-store.dto';
import HandleResponse from 'src/core/utils/handle_response';
import { ApiTags } from '@nestjs/swagger';
import { buildFilters } from 'src/core/utils/helpers';
@ApiTags('store')
@Controller('store')
export class StoreController {
  constructor(private readonly storeService: StoreService) {}

  @Post()
  async create(@Body() createStoreDto: CreateStoreDto) {
    const data = await this.storeService.create(createStoreDto);
    return HandleResponse.buildSuccessObj(201, 'Store created successfully!', data);
  }

  @Get()
  async findAll(@Query() query: Record<string, any>) {
    const filters = buildFilters(query);
    const data = await this.storeService.findAll(filters);
    return HandleResponse.buildSuccessObj(201, 'Stores retrieved successfully!', data || []);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.storeService.findOne(+id);
    return HandleResponse.buildSuccessObj(200, 'Store retrieved successfully!', data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateStoreDto: UpdateStoreDto) {
    const data = await this.storeService.update(+id, updateStoreDto);
    return HandleResponse.buildSuccessObj(200, 'Store updated successfully!', data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.storeService.remove(+id);
    return HandleResponse.buildSuccessObj(200, 'Store removed successfully!', data);
  }
}
