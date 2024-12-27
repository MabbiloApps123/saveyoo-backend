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

  @Column({ type: 'boolean', default: true, select: false })
  is_active!: boolean;

  @Column({ type: 'boolean', default: false, select: false })
  is_deleted!: boolean;

  @CreateDateColumn({ type: 'timestamp', select: false })
  created_at!: Date;

  @UpdateDateColumn({ type: 'timestamp', select: false })
  updated_at!: Date;

  @DeleteDateColumn({ type: 'timestamp', nullable: true, select: false })
  deleted_at!: Date;
}
