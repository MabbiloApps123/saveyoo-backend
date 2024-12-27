import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinTable, JoinColumn } from 'typeorm';
import { BaseModel } from 'src/core/database/BaseModel';
import { StoreProduct } from '../../store-products/entities/store-product.entity';
import { Store } from 'src/modules/store/entities/store.entity';

@Entity({ name: 'products' })
export class Product extends BaseModel {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  product_image: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  category: string;

  @Column('decimal', { precision: 10, scale: 2 })
  original_price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  discounted_price: number;

  @Column()
  currency: string;

  @Column()
  quantity: number;

  @Column('timestamp')
  pickup_start_time: Date;

  @Column('timestamp')
  pickup_end_time: Date;

  @ManyToOne(() => Store, store => store.products)
  @JoinColumn()
  store: Store;

}
