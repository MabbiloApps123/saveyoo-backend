
import { Injectable } from '@nestjs/common';
import { CreateUserAddressDto } from './dto/create-user-address.dto';
import { UpdateUserAddressDto } from './dto/update-user-address.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserAddress } from './entities/user-address.entity';

@Injectable()
export class UserAddressesService {
  constructor(
    @InjectRepository(UserAddress)
    private readonly userAddressRepository: Repository<UserAddress>,
  ) {}
  
  async create(createUserAddressDto: CreateUserAddressDto): Promise<UserAddress> {
    const userAddress = this.userAddressRepository.create(createUserAddressDto);
    return await this.userAddressRepository.save(userAddress);
  }
  
  async findAll(): Promise<UserAddress[]> {
    return await this.userAddressRepository.find();
  }
  
  async findOne(id: number): Promise<UserAddress> {
    return await this.userAddressRepository.findOne({ where: { id } });
  }
  
  async update(id: number, updateUserAddressDto: UpdateUserAddressDto): Promise<UserAddress> {
    await this.userAddressRepository.update(id, updateUserAddressDto);
    return this.findOne(id);
  }
  
  async remove(id: number): Promise<void> {
    await this.userAddressRepository.delete(id);
  }
  
}
