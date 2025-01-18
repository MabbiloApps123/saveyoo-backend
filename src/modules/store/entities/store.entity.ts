import { BaseModel } from 'src/core/database/BaseModel';
import { Product } from 'src/modules/products/entities/product.entity';
import { StoreProduct } from 'src/modules/store-products/entities/store-product.entity';
import { Column, Entity, Geometry, OneToMany } from 'typeorm';

@Entity('stores')
export class Store extends BaseModel {
  @Column({ unique: true })
  name: string;

  @Column({ unique: false, nullable: true })
  image_url: string;

  @Column()
  mobile_no: string;

  @Column()
  alternate_mobile_no: string;

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

  @Column({ default: '' })
  category: string;

  @Column()
  open_time: string; // time in HH:MM format

  @Column()
  close_time: string; //time in HH:MM format

  @Column()
  owner_id: number;

  @Column({ default: null })
  business_start_data: Date;

  @Column({ default: null,select:false })
  gst_no: string;

  @Column({ default: null,select:false })
  acc_no: string;

  @Column({ default: null,select:false })
  ifsc_code: string;

  @Column({ default: null,select:false })
  bank_branch: string;

  // @Column('geometry', { spatialFeatureType: 'Point', srid: 4326 })
  // location: string; // Geospatial column for lat/lng

  @Column({ type: 'decimal',default:0, precision: 10, scale: 6 })
  latitude: number;

  @Column({ type: 'decimal',default:0, precision: 10, scale: 6 })
  longitude: number;

  @OneToMany(() => StoreProduct, (storeProduct) => storeProduct.product)
  storeProducts: StoreProduct[];
}
