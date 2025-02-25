import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { UserAddressesService } from './user-addresses.service';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import HandleResponse from 'src/core/utils/handle_response';
import { ApiTags } from '@nestjs/swagger';

@ApiTags('User Addresses')
@Controller('user-addresses')
export class UserAddressesController {
  constructor(private readonly userAddressesService: UserAddressesService) {}

  @Post()
  async create(@Body() createUserAddressDto: CreateUserAddressDto) {
    const data = await this.userAddressesService.create(createUserAddressDto);
    return HandleResponse.buildSuccessObj(201, 'User address created successfully!', data);
  }

  @Get()
  async findAll() {
    const data = await this.userAddressesService.findAll();
    return HandleResponse.buildSuccessObj(200, 'User addresses retrieved successfully!', data);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.userAddressesService.findOne(+id);
    return HandleResponse.buildSuccessObj(200, 'User address retrieved successfully!', data);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateUserAddressDto: UpdateUserAddressDto) {
    const data = await this.userAddressesService.update(+id, updateUserAddressDto);
    return HandleResponse.buildSuccessObj(200, 'User address updated successfully!', data);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    const data = await this.userAddressesService.remove(+id);
    return HandleResponse.buildSuccessObj(200, 'User address removed successfully!', data);
  }
}

