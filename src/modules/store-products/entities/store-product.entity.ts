import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Product } from '../../products/entities/product.entity';
import { BaseModel } from 'src/core/database/BaseModel';
import { Store } from 'src/modules/store/entities/store.entity';

@Entity({ name: 'store_product' })
export class StoreProduct extends BaseModel {

  @Column('decimal', { precision: 10, scale: 2 })
  original_price: number;

  @Column('decimal', { precision: 10, scale: 2 })
  discounted_price: number;

  @Column()
  currency: string;

  @Column({default:"available_now"})
  deal_type: string;

  @Column()
  quantity: number;

  @Column('timestamp')
  pickup_start_time: Date;

  @Column('timestamp')
  pickup_end_time: Date;

  @ManyToOne(() => Store, (store) => store.storeProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'store_id' })
  store: Store;

  @ManyToOne(() => Product, (product) => product.storeProducts, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'product_id' })
  product: Product;
}

