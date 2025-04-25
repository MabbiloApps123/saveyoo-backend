import { BaseModel } from 'src/core/database/BaseModel';
import { StoreProduct } from 'src/modules/store-products/entities/store-product.entity';
import {  Column, Entity, OneToMany } from 'typeorm';

@Entity('stores')
export class Store extends BaseModel {
  @Column({ unique: true })
  name: string;

  @Column({default:"lorem ipsum lorem ipsum" })
  about: string;

  @Column({default:"https://example.com" })
  web_url: string;

  @Column({default:"https://example.com" })
  icon_url: string;

  @Column({ unique: false, nullable: true })
  image_url: string;

  @Column()
  mobile_no: string;

  @Column()
  alternate_mobile_no: string;

  @Column()
  email: string;

  @Column({ default: false })
  email_verified: boolean;

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

  @Column({ default: '' })
  category: string;

  @Column()
  open_time: string; // time in HH:MM format

  @Column()
  close_time: string; //time in HH:MM format

  @Column()
  owner_id: number;

  @Column({ default: null })
  business_start_date: Date;

  @Column({ default: null,select:true })
  gst_no: string;

  @Column({ default: null,select:false })
  acc_no: string;

  @Column({ default: null,select:false })
  ifsc_code: string;

  @Column({ default: null,select:false })
  bank_branch: string;

  // @Column('geometry', { nullable:true,spatialFeatureType: 'Point', srid: 4326 })
  // location: object;

  @Column({ type: 'decimal', default: 13.08, precision: 10, scale: 2, select: true })
  latitude: number;

  @Column({ type: 'decimal', default: 80.27, precision: 10, scale: 2, select: true })
  longitude: number;

  @Column({default:"452345ASDFA"})
  VAT: string;

  @OneToMany(() => StoreProduct, (storeProduct) => storeProduct.product)
  storeProducts: StoreProduct[];
}
