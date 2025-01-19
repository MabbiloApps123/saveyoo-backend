import { BaseModel } from 'src/core/database/BaseModel';
import { Product } from 'src/modules/products/entities/product.entity';
import { StoreProduct } from 'src/modules/store-products/entities/store-product.entity';
import { Entity, PrimaryGeneratedColumn, ManyToOne, Column, CreateDateColumn } from 'typeorm';

@Entity('favourites')
export class Favourite extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => StoreProduct, { nullable: false, eager: false})
  product: StoreProduct;

  @Column()
  user_id: number;
}
