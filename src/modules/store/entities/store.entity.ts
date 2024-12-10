import { BaseModel } from 'src/core/database/BaseModel';
import { StoreProduct } from 'src/modules/store-products/entities/store-product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity({ name: 'store' })
export class Store extends BaseModel {
  @Column({ unique: true })
  name: string;

  @Column({ unique: false, nullable: true })
  image_url: string;

  @Column()
  phone: string;

  @Column()
  email: string;

  @Column()
  street: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column()
  postal_code: string;

  @Column()
  country: string;

  @OneToMany(() => StoreProduct, (storeProduct) => storeProduct.store) 
  storeProducts: StoreProduct[];
}
