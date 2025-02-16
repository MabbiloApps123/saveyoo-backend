// import {
//   Table,
//   Column,
//   DataType,
//   Unique,
//   Default,
//   AllowNull,
//   BeforeCreate,
//   HasMany,
// } from 'sequelize-typescript';
// import { BaseModel } from 'src/core/database/BaseModel';
// import Encryption from 'src/core/utils/encryption';

// @Table({ timestamps: true, tableName: 'users', underscored: true, paranoid: true })
// export default class User extends BaseModel<User> {
//   @AllowNull(true)
//   @Column(DataType.STRING)
//   user_name: string;

//   @AllowNull(true)
//   @Column(DataType.STRING)
//   profile_url: string;

//   @AllowNull(true)
//   @Column(DataType.STRING)
//   email_id: string;

//   @Column({
//     type: DataType.STRING,
//     set(value: string) {
//       this.setDataValue(
//         'password',
//         value ? Encryption.hashPassword(value) : null,
//       );
//     },
//   })
//   password: string;

//   @AllowNull(true)
//   @Column({
//     type: DataType.STRING,
//   })
//   mobile_no: string;

//   @AllowNull(false)
//   @Default(false)
//   @Column(DataType.BOOLEAN)
//   email_verified: boolean;

//   @AllowNull(true)
//   @Column(DataType.STRING(15))
//   gender: string;

//   @AllowNull(true)
//   @Column(DataType.DATEONLY)
//   dob: Date;

//   @Column(DataType.DATE)
//   last_login: Date;

//   @AllowNull(true)
//   @Column(DataType.TEXT)
//   device_token: string;

//   @AllowNull(false)
//   @Default(false)
//   @Column(DataType.BOOLEAN)
//   is_blocked: boolean;

// }

import { Entity, Column, BeforeInsert, PrimaryGeneratedColumn } from 'typeorm';
import Encryption from 'src/core/utils/encryption'; // Replace with your actual encryption utility.
import { BaseModel } from 'src/core/database/BaseModel';

@Entity({ name: 'users' })
export default class User extends BaseModel {
  @Column({ type: 'varchar', nullable: true })
  user_name: string;

  @Column({ type: 'varchar', nullable: true })
  profile_url: string;

  @Column({ type: 'varchar', nullable: true, unique: true })
  email_id: string;

  @Column({ type: 'varchar', select: false, nullable: true }) // Prevent password from being returned in queries.
  password: string;

  @BeforeInsert()
  async hashPassword() {
    if (this.password) {
      this.password = Encryption.hashPassword(this.password); // Assuming `hash` is an async function.
    }
  }

  @Column({ type: 'varchar', nullable: true })
  mobile_no: string;

  @Column({ type: 'boolean', default: false })
  email_verified: boolean;

  @Column({ type: 'varchar', length: 15, nullable: true })
  gender: string;

  @Column({ type: 'varchar', length: 15, nullable: true })
  user_type: string;

  @Column({ type: 'date', nullable: true })
  dob: Date;

  @Column({ type: 'timestamp', nullable: true })
  last_login: Date;

  @Column({ type: 'text', nullable: true })
  device_token: string;

  @Column({ type: 'boolean', default: false })
  is_blocked: boolean;

  @Column({ type: 'text', array: true, default: () => 'ARRAY[]::text[]' })
  preferences: string[];
}
