import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Point } from 'geojson';
import { Product } from 'src/modules/products/entities/product.entity';
import { StoreProduct } from 'src/modules/store-products/entities/store-product.entity';
import { Store } from 'src/modules/store/entities/store.entity';
import { Repository } from 'typeorm';
import * as fs from 'fs';

@Injectable()
export class Seeder {
  constructor(
    @InjectRepository(Store) private storeRepo: Repository<Store>,
    @InjectRepository(Product) private productRepo: Repository<Product>,
    @InjectRepository(StoreProduct) private storeProductRepo: Repository<StoreProduct>,
  ) {}


  async seed() {
    console.log('🌱 Seeding data...');
  
    // Read and parse the JSON file
    const rawData = fs.readFileSync('src/seed-data.json', 'utf-8');
    const data = JSON.parse(rawData);
  
    // Create Stores
    const stores = await this.storeRepo.save(data.stores);
  
    // Create Products
    const products = await this.productRepo.save(data.products);
  
    // Create Store Products
    const now = new Date();
    const oneHourLater = new Date(now.getTime() + 60 * 60 * 1000);
    const eveningStart = new Date();
    eveningStart.setHours(17, 0, 0, 0);
    const eveningEnd = new Date();
    eveningEnd.setHours(21, 0, 0, 0);
  
    const storeProducts = data.storeProducts.map((sp) => ({
      store: stores[sp.storeIndex],
      product: products[sp.productIndex],
      original_price: sp.original_price,
      discounted_price: sp.discounted_price,
      currency: sp.currency,
      deal_type: sp.deal_type,
      quantity: sp.quantity,
      pickup_start_time: sp.pickup_start_time === 'now' ? now : sp.pickup_start_time === '17:00' ? eveningStart : new Date(now.getTime() + parseInt(sp.pickup_end_time) * 60 * 60 * 1000),
      pickup_end_time: sp.pickup_end_time === '1h' ? oneHourLater : sp.pickup_end_time === '21:00' ? eveningEnd : new Date(now.getTime() + parseInt(sp.pickup_end_time) * 60 * 60 * 1000),
      is_surprise: sp.is_surprise
    }));
  
    await this.storeProductRepo.save(storeProducts);
  
    console.log('✅ Seeding complete!');
  }
  
}
