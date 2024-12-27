import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ApiTags } from '@nestjs/swagger';
import HandleResponse from 'src/core/utils/handle_response';

@ApiTags('products')
@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}
  @Post() async create(@Body() createProductDto: CreateProductDto) {
    const data = await this.productsService.create(createProductDto);
    return HandleResponse.buildSuccessObj(201, 'Product created successfully!', data);
  }
  @Get() async findAll() {
    const data = await this.productsService.findAll();
    return HandleResponse.buildSuccessObj(200, 'Products retrieved successfully!', data);
  }
  @Get(':id') async findOne(@Param('id') id: string) {
    const data = await this.productsService.findOne(+id);
    return HandleResponse.buildSuccessObj(200, 'Product retrieved successfully!', data);
  }
  @Patch(':id') async update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
    const data = await this.productsService.update(+id, updateProductDto);
    return HandleResponse.buildSuccessObj(200, 'Product updated successfully!', data);
  }
  @Delete(':id') async remove(@Param('id') id: string) {
    const data = await this.productsService.remove(+id);
    return HandleResponse.buildSuccessObj(200, 'Product removed successfully!', data);
  }
}
