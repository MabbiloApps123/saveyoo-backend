import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFavouriteDto } from './dto/create-favourite.dto';
import { UpdateFavouriteDto } from './dto/update-favourite.dto';
import { Favourite } from './entities/favourite.entity';
import { StoreProduct } from '../store-products/entities/store-product.entity';

@Injectable()
export class FavouriteService {
  constructor(
    @InjectRepository(Favourite) private readonly favouriteRepository: Repository<Favourite>,
    @InjectRepository(StoreProduct) private readonly storeProductRepository: Repository<StoreProduct>,
  ) {}

  async create(createFavouriteDto: CreateFavouriteDto) {
    const { store_product_id: productId, user_id: userId } = createFavouriteDto;

    const product = await this.storeProductRepository.findOne({ where: { id: productId } });
    if (!product) {
      throw new NotFoundException(`Product with ID ${productId} not found`);
    }

    // Check if the favourite already exists
    const existingFavourite = await this.favouriteRepository.findOne({
      where: { store_product: { id: productId }, user_id: userId },
    });

    if (existingFavourite) {
      existingFavourite.is_active = !existingFavourite?.is_active;
      return await this.favouriteRepository.save(existingFavourite);
    }

    // Create a new favourite if it doesn't exist
    const favourite = new Favourite();
    favourite.store_product = product;
    favourite.user_id = userId;
    favourite.is_active = true; // Default to true for new favourites
    return await this.favouriteRepository.save(favourite);
  }

  async findAll() {
    return await this.favouriteRepository.find({ relations: ['store_product'] });
  }

  async findOne(id: number) {
    const favourite = await this.favouriteRepository.findOne({ where: { id } });
    if (!favourite) {
      throw new NotFoundException(`Favourite with ID ${id} not found`);
    }
    return favourite;
  }

  async update(id: number, updateFavouriteDto: UpdateFavouriteDto) {
    const favourite = await this.findOne(id);

    if (updateFavouriteDto?.store_product_id) {
      const product = await this.storeProductRepository.findOne({
        where: { id: updateFavouriteDto.store_product_id },
      });
      if (!product) {
        throw new NotFoundException(`Product with ID ${updateFavouriteDto.store_product_id} not found`);
      }
      favourite.store_product = product;
    }
    if (updateFavouriteDto.is_active !== undefined) {
      favourite.is_active = updateFavouriteDto.is_active;
    }

    return await this.favouriteRepository.save(favourite);
  }

  async remove(id: number) {
    const favourite = await this.findOne(id);
    favourite.is_active = false; // Mark as inactive instead of deleting
    return await this.favouriteRepository.save(favourite);
  }
}
