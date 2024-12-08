import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from "typeorm";
import { Store } from "./store.entity";


@Entity({name:"contact"})
export class Contact {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  phone: string;

  @Column()
  email: string;

  @OneToOne(() => Store, (store) => store.contact)
  @JoinColumn()
  store: Store;
}