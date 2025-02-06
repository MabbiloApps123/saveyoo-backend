import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { BaseModel } from 'src/core/database/BaseModel';
import { Store } from 'src/modules/store/entities/store.entity';
import { Favourite } from 'src/modules/favourite/entities/favourite.entity';

@Entity({ name: 'store_product' })
export class StoreProduct extends BaseModel {
  @Column('decimal', { precision: 10, scale: 2 })
  original_price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  discounted_price: number;

  @Column()
  currency: string;

  @Column({ default: 'vegan' })
  category: string;

  @Column()
  quantity: number;

  @Column({type:'time',default:"17:00"})
  pickup_start_time: string;

  @Column({type:'time',default:"21:00"})
  pickup_end_time: string;

  @Column({ default: false })
  is_surprise: boolean;

  @ManyToOne(() => Store, (store) => store.storeProducts, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => Product, (product) => product.storeProducts, { onDelete: 'CASCADE', eager: true })
  @JoinColumn({ name: 'product_id' })
  product: Product;

  @ManyToOne(() => Favourite, (favourite) => favourite.store_product)
  favourites: Favourite[];
}
