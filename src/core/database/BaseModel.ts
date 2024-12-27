// import { Column, DataType, Default, Model, PrimaryKey, Sequelize } from 'sequelize-typescript';


//  class BaseModel<T> extends Model {
    
//   @Default(DataType.UUIDV4)
//   @PrimaryKey
//   @Column(DataType.STRING)
//   id!: string;
  
//   @Default(true)
//   @Column(DataType.BOOLEAN)
//   is_active!: boolean;
  
//   @Default(false)
//   @Column(DataType.BOOLEAN)
//   is_deleted!: boolean;


// }

// export default BaseModel;
  


import {
  PrimaryGeneratedColumn,
  BaseEntity,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
} from 'typeorm';

export abstract class BaseModel extends BaseEntity {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ type: 'boolean', default: true })
  is_active!: boolean;

  @Column({ type: 'boolean', default: false })
  is_deleted!: boolean;

  @CreateDateColumn({ type: 'timestamp' })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true })
  deleted_at!: Date;
}
