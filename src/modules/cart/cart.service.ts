import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Cart } from './entities/cart.entity';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { StoreProductService } from '../store-products/store-products.service';
import { SchedulerRegistry } from '@nestjs/schedule';

@Injectable()
export class CartService {
  constructor(
    @InjectRepository(Cart)
    private readonly cartRepository: Repository<Cart>,
    private readonly storeProductService: StoreProductService,
    private readonly schedulerRegistry: SchedulerRegistry,
  ) {}

  async create(createCartDto: CreateCartDto) {
    const { storeProductId, quantity } = createCartDto;

    // Check if the requested quantity is available
    const storeProduct = await this.storeProductService.findOne(storeProductId);
    if (!storeProduct) {
      throw new NotFoundException('Product not found');
    }
    if (storeProduct.quantity < quantity) {
      throw new BadRequestException('Requested quantity not available');
    }

    // Block the product for 15 minutes
    storeProduct.quantity -= quantity;
    await this.storeProductService.update(storeProductId, { quantity: storeProduct.quantity });

    const cart = this.cartRepository.create({
      ...createCartDto,
      storeProduct: storeProduct,
    });
    const savedCart = await this.cartRepository.save(cart);

    // Schedule a task to release the product after 15 minutes
    const timeout = setTimeout(async () => {
      await this.releaseProduct(storeProductId, quantity, savedCart.id);
    }, 15 * 60 * 1000);
    this.schedulerRegistry.addTimeout(`release-product-${savedCart.id}`, timeout);

    return savedCart;
  }

  async findAll() {
    return this.cartRepository.find({ relations: ['storeProduct'] });
  }

  async findOne(id: number) {
    const cart = await this.cartRepository.findOne({ where: { id }, relations: ['storeProduct'] });
    if (!cart) {
      throw new NotFoundException('Cart item not found');
    }
    return cart;
  }

  async findByUserId(userId: number) {
    return this.cartRepository.find({ where: { userId }, relations: ['storeProduct'] }); 
  }

  async update(id: number, updateCartDto: UpdateCartDto) {
    await this.cartRepository.update(id, updateCartDto);
    return this.findOne(id);
  }

  async remove(id: number) {
    const cart = await this.findOne(id);
    await this.cartRepository.delete(id);
    return cart;
  }

  private async releaseProduct(storeProductId: number, quantity: number, cartId: number) {
    const storeProduct = await this.storeProductService.findOne(storeProductId);
    if (storeProduct) {
      storeProduct.quantity += quantity;
      await this.storeProductService.update(storeProductId, { quantity: storeProduct.quantity });
    }
    await this.cartRepository.delete(cartId);
  }
}