import { BaseModel } from 'src/core/database/BaseModel';
import { Store } from 'src/modules/store/entities/store.entity';
import { Column, Entity, ManyToOne } from 'typeorm';

@Entity('orders')
export class Order extends BaseModel {
    @Column()
    order_number: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total_amount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    discount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    final_amount: number;

    @Column()
    payment_status: string; // e.g., 'Pending', 'Completed', 'Failed'

    @Column()
    order_status: string; // e.g., 'Processing', 'Shipped', 'Delivered'

    @Column()
    customer_name: string;

    @Column()
    customer_email: string;

    @Column()
    customer_mobile_no: string;

    @Column()
    shipping_address: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    postal_code: string;

    @Column()
    country: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    order_date: Date;

    @ManyToOne(() => Store, (store) => store.storeProducts)
    store: Store;
}
