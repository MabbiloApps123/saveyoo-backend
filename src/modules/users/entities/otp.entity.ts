// import {
//   Model,
//   DataType,
//   Sequelize,
//   Default,
//   Column,
//   PrimaryKey,
//   BelongsTo,
//   Table,
// } from 'sequelize-typescript';
// import BaseModel from '../../../core/database/BaseModel';

// @Table({ timestamps: true, tableName: 'otp',underscored:true,paranoid:true })
// export default class Otp extends BaseModel<Otp> {
//   @Column(DataType.STRING)
//   user: string;

//   @Column(DataType.STRING(6))
//   otp: string;

//   @Column(DataType.DATE)
//   expires_at: Date;

//   @Column(DataType.DATE)
//   created_at: Date;

// }

import { BaseModel } from 'src/core/database/BaseModel';
import { Entity, Column } from 'typeorm';

@Entity({ name: 'otp' })
export default class Otp extends BaseModel {
  @Column({ type: 'varchar', length: 255 })
  user: string;

  @Column({ type: 'varchar', length: 6 })
  otp: string;

  @Column({ type: 'timestamp' })
  expires_at: Date;
}
