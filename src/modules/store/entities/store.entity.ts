import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';
import { Address } from './address.entity';
import { Contact } from './contact.entity';

@Entity({ name: 'store' })
export class Store {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  name: string;

  @Column({ unique: false, nullable: true })
  image_url: string;

  @OneToOne(() => Address, (address) => address.store)
  @JoinColumn()
  address: Address;

  @OneToOne(() => Contact, (contact) => contact.store)
  @JoinColumn()
  contact: Contact;
}
