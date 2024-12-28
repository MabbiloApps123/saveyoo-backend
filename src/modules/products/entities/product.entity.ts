import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne, JoinTable, JoinColumn } from 'typeorm';
import { BaseModel } from 'src/core/database/BaseModel';
import { StoreProduct } from '../../store-products/entities/store-product.entity';
import { Store } from 'src/modules/store/entities/store.entity';

@Entity({ name: 'products' })
export class Product extends BaseModel {


  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  product_image: string;

  @Column({ type: 'text' })
  description: string;

  @Column()
  category: string;

  @Column()
  currency: string;

 
  @OneToMany(() => StoreProduct, (storeProduct) => storeProduct.store)
  storeProducts: StoreProduct[];

}
