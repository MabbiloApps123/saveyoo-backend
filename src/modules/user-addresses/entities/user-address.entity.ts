import { BaseModel } from "src/core/database/BaseModel";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('user_addresses')
export class UserAddress extends BaseModel {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    userId: number;
    
    @Column()
    name: string;

    @Column()
    address: string;

    @Column()
    city: string;

    @Column()
    state: string;

    @Column()
    postalCode: string;

    @Column()
    country: string;

    @Column()
    phone: string;

    @Column()
    email: string;

    @Column()
    deliveryInstructions: string; 

    @Column()
    addressType: string; 
}

