import { BaseModel } from 'src/core/database/BaseModel';
import { Product } from 'src/modules/products/entities/product.entity';
import { StoreProduct } from 'src/modules/store-products/entities/store-product.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn, OneToMany } from 'typeorm';

@Entity({ name: 'stores' })
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

  @OneToMany(() => Product, (product) => product.store) 
  products: Product[];
}
