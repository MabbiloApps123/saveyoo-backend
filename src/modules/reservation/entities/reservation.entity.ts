import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { StoreProduct } from 'src/modules/store-products/entities/store-product.entity';
import User from 'src/modules/users/entities/user.entity';
import { BaseModel } from 'src/core/database/BaseModel';

@Entity('reservations')
export class Reservation  extends BaseModel{
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => User, (user) => user.reservations, { eager: true })
  user: User;

  @ManyToOne(() => StoreProduct, (storeProduct) => storeProduct.reservations, { eager: true })
  storeProduct: StoreProduct;

  @Column()
  quantity: number;

  @Column()
  paymentMethod: string;

  @Column({ type: 'timestamp' })
  collectionTime: Date;
}
