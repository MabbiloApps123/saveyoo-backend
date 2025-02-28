import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { StoreProduct } from 'src/modules/store-products/entities/store-product.entity';

@Entity()
export class Cart {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quantity: number;

  @Column()
  userId: number;

  @ManyToOne(() => StoreProduct, (storeProduct) => storeProduct.carts)
  storeProduct: StoreProduct;
}