import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FavouriteService } from './favourite.service';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { UpdateFavouriteDto } from './dto/update-favourite.dto';
import HandleResponse from 'src/core/utils/handle_response';
import { ApiTags } from '@nestjs/swagger';

@ApiTags("Favourites")
@Controller('favourite')
export class FavouriteController {
  constructor(private readonly favouriteService: FavouriteService) {}

  @Post()
  async create(@Body() createFavouriteDto: CreateFavouriteDto) {
    let data = await this.favouriteService.create(createFavouriteDto);
    return HandleResponse.buildSuccessObj(200, 'Data created successfully!', data);

  }

  @Get()
  async findAll() {
    let data = await this.favouriteService.findAll();
    return HandleResponse.buildSuccessObj(200, 'Data retrieved successfully!', data);

  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    let data = await this.favouriteService.findOne(+id);
    return HandleResponse.buildSuccessObj(200, 'Data retrieved successfully!', data);

  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateFavouriteDto: UpdateFavouriteDto) {
    let data = await this.favouriteService.update(+id, updateFavouriteDto);
    return HandleResponse.buildSuccessObj(200, 'Data updated successfully!', data);

  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    let data = await this.favouriteService.remove(+id);
    return HandleResponse.buildSuccessObj(200, 'Data removed successfully!', data);

  }
}
