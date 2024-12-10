import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { BaseModel } from 'src/core/database/BaseModel';
import { StoreProduct } from '../../store-products/entities/store-product.entity';

@Entity({ name: 'product' })
export class Product extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  category: string;

  @OneToMany(() => StoreProduct, storeProduct => storeProduct.product)
  store_products: StoreProduct[];
}
